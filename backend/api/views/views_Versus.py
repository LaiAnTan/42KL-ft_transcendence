from numpy import convolve
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.exceptions import ValidationError

from base.models import Versus, User, Matchup
from django.forms.models import model_to_dict
from api.serializer import VersusSerializer, MatchupSerializer
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist


@api_view(['GET'])
def getAllVersus(_request):

	"""
	Not really used, for testing only.
	"""

	all_versus = Versus.objects.all()

	serializer = VersusSerializer(all_versus, many=True)

	return Response(serializer.data)


@api_view(['GET'])
def getVersus(request):

	"""
	API endpoint that returns data of versus matches, queried from the
	database.
	Data regarding matchups is also returned together.
	"""

	versus_ids = request.query_params.get('id')  # Retrieve comma-separated string of IDs
	print(versus_ids)

	if not versus_ids:  # Check if the list of IDs is empty
		return JsonResponse({"Error": '"id" must be included in query parameters'}, status=status.HTTP_400_BAD_REQUEST)

	versus_data = []

	try:
		# Split the comma-separated string of IDs into a list of integers
		versus_id_list = [int(id) for id in versus_ids.split(',')]
		print(versus_id_list)

		for versus_id in versus_id_list:
			print('Trying out ' + str(versus_id))
			versus = Versus.objects.get(pk=versus_id)
			versus_serializer = VersusSerializer(versus)
			matchup = Matchup.objects.get(pk=versus_serializer.data['matchup_id'])
			matchup_serializer = MatchupSerializer(matchup)
			
			matchup_data = matchup_serializer.data
			matchup_data["matchup_id"] = matchup_data.pop('id', 0)
			
			data = {
				**matchup_data,
				"date_played": versus_serializer.data['date_played'],
				"match_type": versus_serializer.data['match_type']
			}
			versus_data.append(data)

	except (ObjectDoesNotExist, ValueError):
		return JsonResponse({"Error": "Entries Not Found in Database or Invalid ID provided"}, status=status.HTTP_400_BAD_REQUEST)

	return JsonResponse(versus_data, safe=False)



# API endpoint abstraction that handles the updating of Versus, Matchup and
# User entries to ease usage / debug process
@api_view(['POST'])
def addVersus(request):

	"""
	API endpoint that adds a versus (1v1) entry to the database.
	Also adds a Matchup entry and updates both players' entries.

	JSON Format:
	{
	"player_1_id": "1",
	"player_2_id": "2",
	"player_1_score": 2,
	"player_2_score": 3,
	"match_type": "pong / dong"
	}
	"""

	# test: all fields are present in request body
	if all(key in request.data for key in ("player_1_id", "player_2_id",
										   "player_1_score",
										   "player_2_score", "match_type")) is False:
		return Response({"Error": "Incomplete request body"},
						status=status.HTTP_400_BAD_REQUEST)

	# test: users exist in database
	try:
		player_1 = User.objects.get(username=request.data['player_1_id'])
		player_2 = User.objects.get(username=request.data['player_2_id'])
	except User.DoesNotExist:
		return Response({"Error": "User Not Found in Database"},
						status=status.HTTP_400_BAD_REQUEST)

	# extract data from request.data into dictionaries for serialization
	matchup_data = {key: request.data[key] for key in 
					MatchupSerializer().fields.keys() if key in request.data}

	# serialize matchup
	matchup_serializer = MatchupSerializer(data=matchup_data)

	# save versus and matchup data into database
	if matchup_serializer.is_valid():
		matchup = matchup_serializer.save()
	else:
		return Response({"Error": "Failed to add entry into Database"},
						status=status.HTTP_400_BAD_REQUEST)

	# serialize versus with matchup_id
	versus_data = {"matchup_id": str(matchup.id), "match_type": request.data['match_type']}
	versus_serializer = VersusSerializer(data=versus_data)

	if versus_serializer.is_valid():
		versus = versus_serializer.save()
	else:
		Matchup.objects.get(id=matchup.id).delete()
		return Response({"Error": "Failed to add entry into Database"},
						status=status.HTTP_400_BAD_REQUEST)

	# append versus id to players versus history
	player_1.versus_history.append(versus.id)
	player_2.versus_history.append(versus.id)

	# update player data
	try:
		player_1.save()
		player_2.save()
	except ValidationError:
		Matchup.objects.get(id=matchup.id).delete()
		Versus.objects.get(id=versus.id).delete()
		return Response({"Error": "Failed to update player entries in\
Database"},
						status=status.HTTP_400_BAD_REQUEST)

	# remove redundant return data (note: serializer.data is immutable)
	matchup_data = matchup_serializer.data
	matchup_data.pop("player_1_id", None)
	matchup_data.pop("player_2_id", None)

	# 0 will never be returned
	matchup_data["matchup_id"] = matchup_data.pop('id', 0)

	# combine all dicts into 1 object for response return
	data = {"date_played": versus_serializer.data['date_played'],
			**matchup_data,
			"player_1_info": player_1.to_json(),
			"player_2_info": player_2.to_json()}

	return Response(data)