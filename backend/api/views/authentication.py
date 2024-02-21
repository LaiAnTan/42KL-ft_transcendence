from rest_framework.response import Response
from rest_framework.decorators import api_view
import requests
import os

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
			
			return Response(ft_me_json, status=200)
		else:
			# If the request failed, return an error response
			return Response({"Error": "Failed to retrieve access token"}, status=ft_access_token.status_code)
	else:
		return Response({"Error": "Code not in request body"}, status=400)