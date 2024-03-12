from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from django.db import transaction

from base.models import Tournament, User, Matchup
from api.serializer import TournamentSerializer, MatchupSerializer, \
	UserSerializer


@api_view(['GET'])
def getAllTournament(_request):

	"""
	Not really used, for testing only.
	"""

	tournaments = Tournament.objects.all()

	serializer = TournamentSerializer(tournaments, many=True)

	return Response(serializer.data)


@api_view(['GET'])
def getTournament(request):

	"""
	API endpoint that returns data of a tournament, queried from the database.
	Data regarding matchups is also returned together.
	"""

	tournament_id = request.query_params.get('id')

	if tournament_id is None:
		return Response({"Error": '"id" must be included in query\
parameters '},
						status=status.HTTP_400_BAD_REQUEST)

	try:

		tournament = Tournament.objects.get(pk=tournament_id)
		tournament_serializer = TournamentSerializer(tournament)
		matchups = Matchup.objects.filter(
			id__in=tournament_serializer.data["matchup_ids"])

	except (Tournament.DoesNotExist, Matchup.DoesNotExist):

		return Response({"Error": "Entries Not Found in Database"},
						status=status.HTTP_400_BAD_REQUEST)

	matchup_serializer = MatchupSerializer(matchups, many=True)

	tournament_data = tournament_serializer.data

	tournament_data.pop('matchup_ids', 0)

	matchup_data = matchup_serializer.data

	# 0 will never be returned
	for matchup in matchup_data:
		matchup["matchup_id"] = matchup.pop('id', 0)

	# consolidate data
	data = {**tournament_data,
			"matchups": matchup_serializer.data}

	return Response(data)


# API endpoint abstraction that handles the updating of Versus, Matchup and
# User entries to ease usage / debug process
@api_view(['POST'])
def addTournament(request):

	"""
	API endpoint that adds a bracket-style-single-elimination-tournament entry
	to the database.
	Also adds all required Matchup entries and updates all players' entries.
	The rankings will be calculated and added into placements, ordered by
	highest ranked player.

	JSON Format:
	{
		"player_ids": [1, 2, 3, 4],
		"matchups": [
			{
				"player_1_id": "1",
				"player_2_id": "2",
				"player_1_score": "2",
				"player_2_score": "3"
			},
			{
				"player_1_id": "3",
				"player_2_id": "4",
				"player_1_score": "5",
				"player_2_score": "2"
			},
			{
				"player_1_id": "2",
				"player_2_id": "3",
				"player_1_score": "3",
				"player_2_score": "2"
			}
		]
	}

	Note: matchups must be in order of the matches played.
	"""

	# checks for the correct JSON format
	if all(key in request.data for key in ("player_ids", "matchups")) is False\
		or all(all(key in matchup for key in ("player_1_id", "player_2_id",
											  "player_1_score",
											  "player_2_score"))
			   for matchup in request.data["matchups"]) is False:
		return Response({"Error": "Incomplete / Incorrect request body"},
						status=status.HTTP_400_BAD_REQUEST)

	users = []

	# check if users exist in database
	try:
		for id in request.data['player_ids']:
			users.append(User.objects.get(id=id))
	except User.DoesNotExist:
		return Response({"Error": "User Not Found in Database"},
						status=status.HTTP_400_BAD_REQUEST)

	counts = {str(key): 0 for key in request.data["player_ids"]}

	for matchup in request.data["matchups"]:

		try:
			counts[matchup["player_1_id"]] += 1
			counts[matchup["player_2_id"]] += 1
		except KeyError:
			return Response({"Error": "Invalid player id in matchups"},
							status=status.HTTP_400_BAD_REQUEST)

	if 0 in counts.values():
		return Response({"Error": "Extra player id in player_ids"},
						status=status.HTTP_400_BAD_REQUEST)

	matchup_serializer = MatchupSerializer(data=request.data["matchups"],
										   many=True)

	if matchup_serializer.is_valid():
		saved_matchups = matchup_serializer.save()
	else:
		return Response({"Error": "Failed to add entry into Database"},
						status=status.HTTP_400_BAD_REQUEST)

	# consolidate tournament data
	tournament_data = {"matchup_ids": [str(matchup.id) for matchup in
									   saved_matchups],
					   "player_ids": request.data["player_ids"],
					   "placements": [getWinner(matchup_serializer.data[-1]),
									  *[getLoser(matchup) for matchup in
										matchup_serializer.data[::-1]]]}

	tournament_serializer = TournamentSerializer(data=tournament_data)

	if tournament_serializer.is_valid():
		tournament = tournament_serializer.save()

	try:
		with transaction.atomic():  # use transaction for rollback if fail
			for user in users:
				user.tournament_history.append(tournament.id)
				user.save()
	except Exception:

		Tournament.objects.get(id=tournament.id).delete()

		for matchup in saved_matchups:
			Matchup.objects.get(id=matchup.id).delete()

		return Response({"Error": "Failed to update player entries in\
Database"},
						status=status.HTTP_400_BAD_REQUEST)

	# data cleanup b4 return
	tournament_data = tournament_serializer.data

	tournament_data.pop("matchup_ids")
	tournament_data.pop("player_ids")

	user_serializer = UserSerializer(users, many=True)

	matchup_data = matchup_serializer.data

	for matchup in matchup_data:
		matchup["matchup_id"] = matchup.pop('id', 0)

	# consolidate for return
	data = {**tournament_data,
			"player_infos": user_serializer.data,
			"matchups": matchup_data}

	return Response(data)


def getWinner(matchup: dict) -> int:

	"""
	Calculates the winner based on the points gained by both players,
	stated in a matchup.

	Assumes that there are no draws in the game.
	"""

	return matchup["player_1_id"] if matchup["player_1_score"] > \
		matchup["player_2_score"] else matchup["player_2_id"]


def getLoser(matchup: dict) -> int:

	"""
	Calculates the loser based on the points gained by both players,
	stated in a matchup.

	Assumes that there are no draws in the game.
	"""

	return matchup["player_1_id"] if matchup["player_1_score"] < \
		matchup["player_2_score"] else matchup["player_2_id"]
