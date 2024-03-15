from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['POST'])
def alert(request):
    
    print(request)
    
    return Response({"Ok": "Ok"})
