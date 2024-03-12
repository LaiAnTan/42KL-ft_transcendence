from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core.exceptions import FieldDoesNotExist

from base.models import User
from api.serializer import UserSerializer


@api_view(['GET'])
def getAllUsers(_request):

	users = User.objects.all()

	serializer = UserSerializer(users, many=True)

	return Response(serializer.data)


@api_view(['GET'])
def getUser(request):

	username = request.query_params.get('username')

	if username is None:
		return Response({"Error": '"username" must be included in query\
parameters '},
						status=status.HTTP_400_BAD_REQUEST)

	try:
		user = User.objects.get(username=username)
	except User.DoesNotExist:
		return Response({"username": ""},
						status=status.HTTP_200_OK)

	serializer = UserSerializer(user)
	return Response(serializer.data)


@api_view(['POST'])
def addUser(request):

	"""
	API endpoint that adds a user to the database.

	JSON Format:
	{
	"username": "user",
	"display_name": "User",
	"email": "user@user.com",
	"versus_history": [],
	"tournament_history": []
	}

	versus_history, tournament_history are optional fields, if not specified
	a default will be used.
	"""

	try:
		username = request.data['username']
	except KeyError:
		return Response({"Error": "Username not in request body"},
						status=status.HTTP_400_BAD_REQUEST)

	# add defaults if not specified
	if 'versus_history' not in request.data:
		request.data['versus_history'] = []

	if 'tournament_history' not in request.data:
		request.data['tournament_history'] = []

	serializer = UserSerializer(data=request.data)

	if User.objects.filter(username=username).exists():
		return Response({"Error": "User already exists in Database"},
						status=status.HTTP_400_BAD_REQUEST)

	if serializer.is_valid():
		serializer.save()
	else:
		return Response({"Error": "Failed to add User into Database"},
						status=status.HTTP_400_BAD_REQUEST)

	return Response(serializer.data)

@api_view(['POST'])
def editUserFields(request):

    """
    API endpoint that edits the specified user's fields in the database.

    JSON Format:
    {
    "display_name": "User",
    "email": "user@user.com",
    "versus_history": [],
    "tournament_history": []

    ...+ any fields to be edited
    }
    """
    
    username = request.query_params.get('username')

    if username is None:
        return Response({"Error": '"username" must be included in query\
parameters '},
                        status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"Error": "User Not Found in Database"},
                        status=status.HTTP_400_BAD_REQUEST)
    
    for field in request.data.keys():
        try:
            User._meta.get_field(field)
        except FieldDoesNotExist:
            return Response({"Error": f"Field '{field}' does not exist in User\
model"},
                            status=status.HTTP_400_BAD_REQUEST)

    serializer = UserSerializer(user, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
    else:
        return Response({"Error": "Failed to Update User Fields"},
                        status=status.HTTP_400_BAD_REQUEST)

    return Response(serializer.data)