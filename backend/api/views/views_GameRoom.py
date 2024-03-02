from rest_framework.response import Response
from rest_framework.decorators import api_view
import requests
import os
import random

rooms = []

def generateRoomCode():
	room_code = ''.join(random.choices('0123456789', k=6))
	while room_code in rooms:
		room_code = ''.join(random.choices('0123456789', k=6))
	rooms.append(room_code)
	return room_code

# get room code for matchmaking, if no room available, create a new one
@api_view(['GET'])
def matchmaking(request):
	if len(rooms) == 0:
		room_code = generateRoomCode()
	else:
		room_code = rooms[0]
	return Response({'roomID': room_code})

# close room when game is full (2 player)
@api_view(['POST'])
def closeRoom(request):
	room_code = request.GET.get('room_code')
	if room_code in rooms:
		rooms.remove(room_code)
		return Response({'message': 'Room closed'})
	else:
		return Response({'message': 'Room not found'}, status=404)

# join room to make sure the room is exist
@api_view(['GET'])
def joinRoom(request, room_code):
	if room_code in rooms:
		return Response({'message': 'Room found'})
	else:
		return Response({'message': 'Room not found'}, status=404)

# get all rooms
@api_view(['GET'])
def allRooms(_request):
	return Response({'rooms': rooms})