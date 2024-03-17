from rest_framework.response import Response
from rest_framework.decorators import api_view
import requests
import os
import random

rooms = {}
MAX_CLIENTS_PER_ROOM = 2

def generateRoomCode():
	room_code = ''.join(random.choices('0123456789', k=6))
	while room_code in rooms:
		room_code = ''.join(random.choices('0123456789', k=6))
	rooms[room_code] = []
	return room_code

@api_view(['GET'])
def matchmaking(request):
	client_id = request.GET.get('clientID')
	for room_code, clients in rooms.items():
		if len(clients) < MAX_CLIENTS_PER_ROOM:
			clients.append(client_id)
			return Response({'roomID': room_code})

	# If no available room, create a new one
	room_code = generateRoomCode()
	rooms[room_code].append(client_id)
	return Response({'roomID': room_code})

# close room when game is full (2 player)
@api_view(['DELETE'])
def closeRoom(request):
	room_code = request.GET.get('room_code')
	if room_code in rooms:
		del rooms[room_code]  # Remove the room code from the rooms dictionary
		return Response({'message': 'Room closed'})
	else:
		return Response({'message': 'Room not found'}, status=404)

# close all rooms
@api_view(['DELETE'])
def closeAllRooms(request):
	rooms.clear()
	return Response({'message': 'All rooms closed'})

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
