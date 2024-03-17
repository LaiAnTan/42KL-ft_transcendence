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

class DownloadImageFailed(Exception):
    
    """
    Custom exception for images that fail to download.
    """
    
    pass

@api_view(['POST'])
def postCode(request):
	code = request.data.get('code')

	if code is not None:
		ft_access_token = requests.post("https://api.intra.42.fr/oauth/token?grant_type=authorization_code&client_id="+UID+"&client_secret="+SECRET+"&redirect_uri="+REDIR_URI+"&code="+code+"&state=123")
		if ft_access_token.status_code == 200:
			access_token_data = ft_access_token.json()
			access_token = access_token_data.get("access_token")
			ft_me = requests.get("https://api.intra.42.fr/v2/me", headers={"Authorization": "Bearer "+ft_access_token.json()["access_token"]})
			ft_me_json = ft_me.json()

			username = ft_me_json.get("login")
			
			versus_history = []
			tournament_history = []

			existing_user = User.objects.filter(username=username).first()

			url = ft_me_json.get("image", {}).get("link")

			path, _ = urllib.request.urlretrieve(url)

			with open(path, 'rb') as f:

				profile_pic = ImageFile(File(f), os.path.basename(url))

				if existing_user:
					return Response({"Success": "User already exists", "user_id": existing_user.id, "json": existing_user.to_json()}, status=200)
				else:
					user_instance = User.objects.create(
						username=username,
						display_name=ft_me_json.get("displayname"),
						email=ft_me_json.get("email"),
						profile_pic=profile_pic,
						versus_history=versus_history,
						tournament_history=tournament_history
					)
				return Response({"Success": "User data stored successfully", "user_id": user_instance.id, "json": user_instance.to_json()}, status=200)

		else:
			# If the request failed, return an error response
			return Response({"Error": "Failed to retrieve access token"}, status=ft_access_token.status_code)
	else:
		return Response({"Error": "Code not in request body"}, status=400)