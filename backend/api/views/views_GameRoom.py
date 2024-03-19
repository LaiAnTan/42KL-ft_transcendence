from rest_framework.response import Response
from rest_framework.decorators import api_view
import requests
import os
import random

pong_rooms = {}
dong_rooms = {}
MAX_CLIENTS_PER_ROOM = 2

def generateRoomCode(game_mode):
	room_code = ''.join(random.choices('0123456789', k=6))
	while room_code in pong_rooms or room_code in dong_rooms:
		room_code = ''.join(random.choices('0123456789', k=6))
	if game_mode == 'pong':
		pong_rooms[room_code] = []
	elif game_mode == 'dong':
		dong_rooms[room_code] = []
	return room_code

def joinRoom(game_mode, rooms, client_id):
    for room_code, clients in rooms.items():
        if len(clients) < MAX_CLIENTS_PER_ROOM:
            clients.append(client_id)
            return room_code
    room_code = generateRoomCode(game_mode)
    rooms[room_code] = [client_id]
    return room_code

@api_view(['GET'])
def matchmaking(request):
    client_id = request.GET.get('clientID')
    game_mode = request.GET.get('gameMode')

    if game_mode == 'pong':
        room_code = joinRoom(game_mode, pong_rooms, client_id)
    elif game_mode == 'dong':
        room_code = joinRoom(game_mode, dong_rooms, client_id)
    else:
        return Response({'error': 'Invalid game mode'})

    return Response({'roomID': room_code})

# close room when game is full (2 player)
@api_view(['DELETE'])
def closeRoom(request):
	room_code = request.GET.get('room_code')
	game_mode = request.GET.get('gameMode')
	if game_mode == 'pong':
		rooms = pong_rooms
	elif game_mode == 'dong':
		rooms = dong_rooms
	else:
		return Response({'error': 'Invalid game mode'}, status=400)
	if room_code in rooms:
		del rooms[room_code]  # Remove the room code from the rooms dictionary
		return Response({'message': 'Room closed'})
	else:
		return Response({'message': 'Room not found'}, status=404)

# close all rooms
@api_view(['DELETE'])
def closeAllRooms(request):
	game_mode = request.GET.get('gameMode')
	if game_mode == 'pong':
		pong_rooms.clear()
	elif game_mode == 'dong':
		dong_rooms.clear()
	elif game_mode == 'all':
		pong_rooms.clear()
		dong_rooms.clear()
	return Response({'message': game_mode + ' rooms closed'}, status=200)

# get all rooms
@api_view(['GET'])
def allRooms(_request):
	return Response({'pong': pong_rooms, 'dong': dong_rooms})

tournament_rooms = {}
tournament_running = False
number_of_players = 0

@api_view(['GET'])
def tournamentInit(_request):
	global tournament_running
	if tournament_running is True:
		return Response({"message": "tournament is running"}, status=400)
	for x in range(4):
		code = ''.join(random.choices('0123456789', k=6))
		if code not in tournament_rooms:
			tournament_rooms[code] = []
	tournament_running = True
	return Response({"message": "tournament is initialized"}, status=200)

@api_view(['GET'])
def tournamentAssign(_request):
	global tournament_running
	client_id = _request.GET.get('clientID')
	if tournament_running is False:
		return Response({'message': 'tournament is not initialized'}, status=400)
	for room_code, clients in tournament_rooms.items():
		if number_of_players is 8:
			break
		number_of_players + 1
		if len(clients) < MAX_CLIENTS_PER_ROOM:
			clients.append(client_id)
			return Response({'roomID': room_code})
	return Response({'message': 'tournament is full'})

@api_view(['GET'])
def tournamentAllRooms(_request):
	return Response({"tourney": tournament_rooms})

@api_view(['DELETE'])
def tournamentEnd(_request):
	tournament_rooms.clear()
	return Response({'message': 'game has ended'}, status=200)