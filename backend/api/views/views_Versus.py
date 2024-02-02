from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.exceptions import ValidationError

from base.models import Versus, User, Matchup
from django.forms.models import model_to_dict
from api.serializer import VersusSerializer, MatchupSerializer


@api_view(['GET'])
def getAllVersus(request):

    all_versus = Versus.objects.all()

    serializer = VersusSerializer(all_versus, many=True)

    return Response(serializer.data)


@api_view(['GET'])
def getVersus(request):

    versus_id = request.query_params.get('id')

    if versus_id is None:
        return Response({"Error": '"id" must be included in query\
parameters '},
                        status=status.HTTP_400_BAD_REQUEST)

    try:
        versus = Versus.objects.get(pk=versus_id)
        versus_serializer = VersusSerializer(versus)
        matchup = Matchup.objects.get(pk=versus_serializer.data['matchup_id'])
    except (Versus.DoesNotExist, Matchup.DoesNotExist):
        return Response({"Error": "Entries Not Found in Database"},
                        status=status.HTTP_400_BAD_REQUEST)

    matchup_serializer = MatchupSerializer(matchup)

    matchup_data = matchup_serializer.data

    # 0 will never be returned
    matchup_data["matchup_id"] = matchup_data.pop('id', 0)

    # consolidate data
    data = {**matchup_data,
            "date_played": versus_serializer.data['date_played']}

    return Response(data)


# API endpoint abstraction that handles the updating of Versus, Matchup and
# User entries to ease usage / debug process
@api_view(['POST'])
def addVersus(request):

    # test: all fields are present in request body
    if all(key in request.data for key in ("player_1_id", "player_2_id",
                                           "player_1_score",
                                           "player_2_score")) is False:
        return Response({"Error": "Incomplete request body"},
                        status=status.HTTP_400_BAD_REQUEST)

    # test: users exist in database
    try:
        player_1 = User.objects.get(id=request.data['player_1_id'])
        player_2 = User.objects.get(id=request.data['player_2_id'])
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
    versus_data = {"matchup_id": str(matchup.id)}
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
            "player_1_info": model_to_dict(player_1),
            "player_2_info": model_to_dict(player_2)}

    return Response(data)
