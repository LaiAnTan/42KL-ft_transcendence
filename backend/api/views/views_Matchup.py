from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from base.models import Matchup, User
from api.serializer import MatchupSerializer


@api_view(['GET'])
def getMatchup(request, **kwargs):

    match_id = request.query_params.get('id')

    if match_id is None:
        return Response({"Error": '"id" must be included in query\
parameters '},
                        status=status.HTTP_400_BAD_REQUEST)

    match = Matchup.objects.get(pk=match_id)
    serializer = MatchupSerializer(match)
    return Response(serializer.data)


@api_view(['GET'])
def getAllMatchups(_request):

    matchups = Matchup.objects.all()

    serializer = MatchupSerializer(matchups, many=True)

    return Response(serializer.data)


# should not be called directly, addVersus / addTournament will add a Matchup
# entry automatically
@api_view(['POST'])
def addMatchup(request):

    try:
        user_1_id = request.data['player_1_id']
        user_2_id = request.data['player_2_id']
        User.objects.get(id=user_1_id)
        User.objects.get(id=user_2_id)
    except KeyError:
        return Response({"Error": "Player ID not in request body"},
                        status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({"Error": "User Not Found in Database"},
                        status=status.HTTP_400_BAD_REQUEST)

    serializer = MatchupSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)
