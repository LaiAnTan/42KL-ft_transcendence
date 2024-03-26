from rest_framework.response import Response
from rest_framework.decorators import api_view
import subprocess

sps = {}

@api_view(['GET'])
def startGameAI(request):

    # add player id to keep track of subprocess
    mode = request.query_params.get('mode')

    if mode is None:
        return Response({"Error": '"mode" must be included in query parameters'})

    try:
        subprocess.Popen(['python3', './backend/ai.py'])
    except Exception as e:
        return Response({"Error": f"Failed to start AI: {str(e)}"})

    return Response({"Success": "Game AI Started"})
