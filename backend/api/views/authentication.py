from rest_framework.response import Response
from rest_framework.decorators import api_view
import os
import urllib.request
import requests
from base.models import User

from django.core.files.images import ImageFile
from django.core.files import File
from django.core.files.base import ContentFile
from django.conf import settings
from django.utils.crypto import get_random_string

import logging

logger = logging.getLogger(__name__)

UID = os.getenv("UID")
SECRET = os.getenv("SECRET")
REDIR_URI = os.getenv("REDIRECT_URI")

@api_view(['GET'])
def get_auth_config(request):
	auth_config = {
		'clientID': UID,
		'redirectURI': REDIR_URI,
	}
	return Response(auth_config)

@api_view(['POST'])
def postCode(request):
	code = request.data.get('code')
 
	if code is None:
		return Response({"Error": "Code not in request body"}, status=400)

	ft_access_token = requests.post("https://api.intra.42.fr/oauth/token?grant_type=authorization_code&client_id="+UID+"&client_secret="+SECRET+"&redirect_uri="+REDIR_URI+"&code="+code+"&state=123")
	
	if ft_access_token.status_code != 200:
		# If the request failed, return an error response
		return Response({"Error": "Failed to retrieve access token"},
						status=ft_access_token.status_code)

	ft_me = requests.get("https://api.intra.42.fr/v2/me",
					 	 headers={"Authorization": "Bearer "+ft_access_token.json()["access_token"]})
	ft_me_json = ft_me.json()

	username = ft_me_json.get("login")

	existing_user = User.objects.filter(username=username).first()

	if existing_user:
		return Response({"Success": "User already exists",
						 "user_id": existing_user.id,
						 "json": existing_user.to_json()}, status=200)

	versus_history = []
	tournament_history = []

	url = ft_me_json.get("image", {}).get("link")

	if url is not None:
		path, _ = urllib.request.urlretrieve(url)
	else:
		path = settings.DEFAULT_IMAGE_PATH

	f = open(path, 'rb')

	profile_pic = ImageFile(File(f), get_random_string(length=32) + "." + \
							os.path.basename(path).split(".")[-1])

	user_instance = User.objects.create(
		username=username,
		display_name=ft_me_json.get("displayname"),
		email=ft_me_json.get("email"),
		profile_pic=profile_pic,
		versus_history=versus_history,
		tournament_history=tournament_history
	)

	f.close()

	return Response({"Success": "User data stored successfully",
					 "user_id": user_instance.id,
					 "json": user_instance.to_json()}, status=200)
