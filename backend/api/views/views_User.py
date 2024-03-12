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

