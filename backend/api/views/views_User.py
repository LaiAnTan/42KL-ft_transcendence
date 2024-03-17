from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core.exceptions import FieldDoesNotExist
from django.utils.crypto import get_random_string
from django.core.files.images import ImageFile

from base.models import User
from api.serializer import UserSerializer, ImageSerializer

import os
from django.conf import settings


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
    !! "profile_pic": (JS File object)
	"versus_history": [],
	"tournament_history": []
	}

    !! must use contentType: multipart/form-data
    
    
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
def editUser(request):

    """
    API endpoint that edits the specified user's fields in the database.

    JSON Format:
    {
    "display_name": "User",
    "email": "user@user.com",
    "versus_history": [],
    "tournament_history": []
    !! "profile_pic": (JS File object)

    ...+ any fields to be edited
    }
    
    !! must use contentType: multipart/form-data
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

    if 'profile_pic' in request.FILES:
        profile_pic = ImageFile(request.FILES['profile_pic'])
        profile_pic.name = request.FILES['profile_pic'].name
        request.data['profile_pic'] = profile_pic

    serializer = UserSerializer(user, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
    else:
        return Response({"Error": "Failed to Update User Fields"},
                        status=status.HTTP_400_BAD_REQUEST)

    return Response(serializer.data)

@api_view(['DELETE'])
def deleteUser(request):

    """
    API endpoint that deletes the specified user entry in the database.
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
    
    user.delete()

    return Response({"Success": f"User {username} deleted from Database"})

@api_view(['POST'])
def uploadProfile(request):
    
    """
    API endpoint that uploads a profile picture for a specified user
    entry in the database.
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

    img_serializer = ImageSerializer(data=request.data)

    if img_serializer.is_valid() is False:
        return Response(img_serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)

    image = img_serializer.validated_data['image']

    file_path = os.path.join(settings.MEDIA_ROOT,
                             get_random_string(length=32) + "." + \
                                               image.name.split(".")[-1])
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
    with open(file_path, 'wb') as f:
        for chunk in image.chunks():
            f.write(chunk)
            
    image_file = ImageFile(open(file_path, 'rb'))
    image_file.name = os.path.basename(file_path)

    if user.profile_pic:
        user.profile_pic.delete()  # Delete the old profile picture

    user_serializer = UserSerializer(user, data={"profile_pic": image_file},
                                     partial=True)
    
    if user_serializer.is_valid():
        user_serializer.save()
    else:
        return Response({"Error": "Failed to Update User Fields"},
                        status=status.HTTP_400_BAD_REQUEST)

    return Response(user_serializer.data)
