from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from base.models import User
from api.serializer import UserSerializer

@api_view(['GET'])
def getAllUsers(_request):

    users = User.objects.all()

    serializer = UserSerializer(users, many=True)

    return Response(serializer.data)



@api_view(['GET'])
def getUser(_request, **kwargs):

    username = kwargs['username']

    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"Error": "User Not Found"},
                        status=status.HTTP_400_BAD_REQUEST)

    serializer = UserSerializer(user)
    return Response(serializer.data)


@api_view(['POST'])
def addUser(request):

    try:
        username = request.data['username']
    except KeyError:
        return Response({"Error": "Username not in POST request body"},
                        status=status.HTTP_400_BAD_REQUEST)

    serializer = UserSerializer(data=request.data)

    if serializer.is_valid() and \
            not User.objects.filter(username=username).exists():
        serializer.save()

    return Response(serializer.data)


# @api_view(['GET'])
# def getMatch(request, **kwargs):

#     match_id = request.query_params.get('id')

#     match = Match.objects.get(pk=match_id)
#     serializer = MatchSerializer(match)
#     return Response(serializer.data)


# @api_view(['POST'])
# def addMatch(request):
#     pass
