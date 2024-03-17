from rest_framework.response import Response
from rest_framework.decorators import api_view
import requests
import os
from base.models import User

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
			if existing_user:
				return Response({"Success": "User already exists", "user_id": existing_user.id, "json": existing_user.to_json()}, status=200)
			else:
				user_instance = User.objects.create(
					username=username,
					display_name=ft_me_json.get("displayname"),
					email=ft_me_json.get("email"),
					profile_pic=ft_me_json.get("image", {}).get("link"),
					versus_history=versus_history,
					tournament_history=tournament_history
				)
			return Response({"Success": "User data stored successfully", "user_id": user_instance.id, "json": user_instance.to_json()}, status=200)
			# return Response(ft_me_json, status=200)
		else:
			# If the request failed, return an error response
			return Response({"Error": "Failed to retrieve access token"}, status=ft_access_token.status_code)
	else:
		return Response({"Error": "Code not in request body"}, status=400)