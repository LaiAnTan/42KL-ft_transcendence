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

tournament_rooms = {}
tournament_running = False
players = []
tourney_room_num = 4

@api_view(['GET'])
def tournamentInit(_request):
    global tournament_running
    if tournament_running is True:
        return Response({"message": "tournament is running"}, status=400)
    for x in range(tourney_room_num):
        code = ''.join(random.choices('0123456789', k=6))
        if code not in tournament_rooms:
            tournament_rooms[code] = []
    tournament_running = True
    return Response({"message": "tournament is initialized"}, status=200)

@api_view(['GET'])
def tournamentAssign(_request):
    global tournament_running, players
    client_id = _request.GET.get('clientID')
    if tournament_running is False:
        return Response({'message': 'tournament is not initialized'}, status=400)
    for room_code, clients in tournament_rooms.items():
        if len(players) == tourney_room_num * 2:
            break
        if len(clients) < MAX_CLIENTS_PER_ROOM:
            players.append(client_id)
            clients.append(client_id)
            return Response({'roomID': room_code})
    return Response({'message': 'tournament is full', 'players': players}, status=400)

@api_view(['GET'])
def tournamentAllRooms(_request):
    return Response({"tourney": tournament_rooms})

@api_view(['DELETE'])
def tournamentEnd(_request):
    global tournament_rooms, tournament_running, players, tourney_room_num
    tournament_rooms.clear()
    tournament_running = False
    players.clear()
    tourney_room_num = 4
    return Response({'message': 'game has ended'}, status=200)

def create_next_round():
    global tournament_rooms, players, tourney_room_num
    tourney_room_num //= 2
    new_rooms = {}

    players.clear()
    for i in range(tourney_room_num):
        code = ''.join(random.choices('0123456789', k=6))
        if code not in new_rooms:
            new_rooms[code] = []
    tournament_rooms = new_rooms

@api_view(['POST'])
def tournamentLoser(_request):
    global tournament_rooms, tournament_running, players, tourney_room_num
    client_id = _request.GET.get('clientID')
    match_id = _request.GET.get('matchID')
    for room_code, clients in tournament_rooms.items():
        if room_code == match_id:
            if client_id in clients:
                clients.remove(client_id)
                players.remove(client_id)
                if len(players) == 1:
                    return Response({'message': tournament_rooms[room_code][0] + ' has won the tournament!'}, status=200)
                if len(players) == 4 or len(players) == 2:
                    create_next_round()
                return Response({'message': client_id + ' has lost in ' + match_id}, status=200)
            else:
                return Response({'message': 'client not found'}, status=400)
    return Response({'message': 'match not found'}, status=400)