from rest_framework.response import Response
from rest_framework.decorators import api_view

from base.models import User
from api.serializer import UserSerializer


@api_view(['GET'])  # allowed methods
def getData(_request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getUserData(_request, **kwargs):

    user = User.objects.get(username=kwargs['username'])
    serializer = UserSerializer(user)
    return Response(serializer.data)


@api_view(['POST'])
def sendData(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)
