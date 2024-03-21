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
		  
	if 'friends' not in request.data:
		request.data['friends'] = []

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

@api_view(['POST'])
def addFriend(request):
	"""
	API endpoint that adds a friend for a user.

	JSON Format:
	{
		"username": "user",
		"friend_username": "friend"
	}
	"""

	try:
		username = request.data['username']
		friend_username = request.data['friend_username']
	except KeyError:
		return Response({"Error": "Username or friend_username not in request body"},
						status=status.HTTP_400_BAD_REQUEST)

	try:
		user = User.objects.get(username=username)
		friend = User.objects.get(username=friend_username) # Check if the "friend" exists
	except User.DoesNotExist:
		return Response({"Error": "User does not exist"},
						status=status.HTTP_404_NOT_FOUND)

	if user.friends:
		if friend_username in user.friends:
			return Response({"Error": f"{friend_username} already added as a friend"},
							status=status.HTTP_200_OK)
		user.friends.append(friend_username)
		friend.friends.append(username)
	else:
		user.friends = [friend_username]
		friend.friends = [username]

	user.save()
	friend.save()

	return Response({"Success": f"{friend_username} added as a friend"},
					status=status.HTTP_200_OK)

@api_view(['POST'])
def removeFriend(request):
	"""
	API endpoint that removes a friend from a user's friend list.

	JSON Format:
	{
		"username": "user",
		"friend_username": "friend"
	}
	"""

	try:
		username = request.data['username']
		friend_username = request.data['friend_username']
	except KeyError:
		return Response({"Error": "Username or friend_username not in request body"},
						status=status.HTTP_400_BAD_REQUEST)

	try:
		user = User.objects.get(username=username)
		friend = User.objects.get(username=friend_username)
	except User.DoesNotExist:
		return Response({"Error": "User or friend does not exist"},
						status=status.HTTP_404_NOT_FOUND)

	if user.friends is not None:
		if friend_username not in user.friends:
			return Response({"Error": f"{friend_username} is not in the friend list"},
							status=status.HTTP_200_OK)

		user.friends.remove(friend_username)
		friend.friends.remove(username)
		user.save()
		friend.save()

		return Response({"Success": f"{friend_username} removed from friend list"},
						status=status.HTTP_200_OK)
	else:
		return Response({"Error": "Friend list is empty"},
						status=status.HTTP_200_OK)

@api_view(['GET'])
def getFriends(request):
	"""
	API endpoint that retrieves friends for a user.

	Query Parameters:
	- username: The username of the user whose friends to retrieve
	"""

	username = request.query_params.get('username')

	if username is None:
		return Response({"Error": '"username" must be included in query parameters'},
						status=status.HTTP_400_BAD_REQUEST)

	try:
		user = User.objects.get(username=username)
	except User.DoesNotExist:
		return Response({"Error": "User does not exist"},
						status=status.HTTP_404_NOT_FOUND)

	friends = user.friends

	friends_details = []

	if friends is not None:
		for friend_username in friends:
			friend = User.objects.get(username=friend_username)
			friend_data = {
				"username": friend.username,
				"display_name": friend.display_name,
				"profile_pic": friend.profile_pic.url if friend.profile_pic else "",
				"is_online": friend.is_online
			}
			friends_details.append(friend_data)

	return Response({"friends": friends_details}, status=status.HTTP_200_OK)

@api_view(['POST'])
def setOnlineStatus(request):
	"""
	API endpoint that sets the online status for a user.

	JSON Format:
	{
		"username": "user",
		"is_online": true/false
	}
	"""

	try:
		username = request.data['username']
		is_online = request.data['is_online']
	except KeyError:
		return Response({"Error": "Username or is_online not in request body"},
						status=status.HTTP_400_BAD_REQUEST)

	try:
		user = User.objects.get(username=username)
	except User.DoesNotExist:
		return Response({"Error": "User does not exist"},
						status=status.HTTP_404_NOT_FOUND)

	user.is_online = is_online
	user.save()

	return Response({"Success": f"Online status for user {username} set to {is_online}"},
					status=status.HTTP_200_OK)

@api_view(['GET'])
def getOnlineStatus(request):
    """
    API endpoint that gets the online status for a user.

    JSON Format:
    {
        "username": "user"
    }
    """

    try:
        username = request.query_params['username']
    except KeyError:
        return Response({"Error": "Username not provided in query parameters"},
                        status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"Error": "User does not exist"},
                        status=status.HTTP_404_NOT_FOUND)

    return Response({"is_online": user.is_online},
                    status=status.HTTP_200_OK)