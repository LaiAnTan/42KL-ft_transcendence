from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from django.contrib.auth import get_user_model
# from django.db import IntegrityError
# from django.core.exceptions import ObjectDoesNotExist
import requests
import os
import logging

UID = os.getenv("UID")
SECRET = os.getenv("SECRET")
REDIR_URI = os.getenv("REDIRECT_URI")
USER = get_user_model()

log = logging.getLogger(__name__)

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
			

			user, created = USER.objects.get_or_create(id=ft_me_json["id"], defaults={'username': ft_me_json["login"], 'email': ft_me_json["email"]})
			log.info('id from api: %s' % ft_me_json["id"])
			jwt_refresh = RefreshToken.for_user(user)
			jwt_token = str(jwt_refresh.access_token)
			log.info('jwt token: %s' % jwt_token)

			try:
				decoded = AccessToken(jwt_token)
				payload = decoded.payload
				log.debug('payload: %s' % payload)
			except Exception as e:
				log.error('error: %s' % str(e))

			response = Response(ft_me_json, status=200)
			response.set_cookie('jwt', jwt_token, httponly=True)

			return response
			# return Response(ft_me_json, status=200)
		else:
			# If the request failed, return an error response
			return Response({"Error": "Failed to retrieve access token"}, status=ft_access_token.status_code)
	else:
		return Response({"Error": "Code not in request body"}, status=400)