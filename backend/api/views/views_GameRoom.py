from rest_framework.response import Response
from rest_framework.decorators import api_view
import requests
import os
import random

pong_rooms = {}
dong_rooms = {}
MAX_CLIENTS_PER_ROOM = 2

def generateRoomCode(rooms):
    room_code = ''.join(random.choices('0123456789', k=6))
    while room_code in pong_rooms or room_code in dong_rooms:
        room_code = ''.join(random.choices('0123456789', k=6))
    rooms[room_code] = []
    return room_code

def joinRoom(rooms, client_id):
    for room_code, clients in rooms.items():
        if client_id in clients:
            return room_code
        if len(clients) < MAX_CLIENTS_PER_ROOM:
            clients.append(client_id)
            return room_code
    room_code = generateRoomCode(rooms)
    rooms[room_code] = [client_id]
    return room_code

def alreadyInRoom(client_id, rooms):
    for clients in rooms.values():
        if client_id in clients:
            return True

    return False

@api_view(['GET'])
def matchmaking(request):
    client_id = request.GET.get('clientID')
    game_mode = request.GET.get('gameMode')

    if game_mode == 'pong':
        if alreadyInRoom(client_id, dong_rooms):
            return Response({'error': 'Client in another game mode'}, status=400)
        room_code = joinRoom(pong_rooms, client_id)
    elif game_mode == 'dong':
        if alreadyInRoom(client_id, pong_rooms):
            return Response({'error': 'Client in another game mode'}, status=400)
        room_code = joinRoom(dong_rooms, client_id)
    else:
        return Response({'error': 'Invalid game mode'}, status=400)
    return Response({'roomID': room_code}, status=200)

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

@api_view(['DELETE'])
def exitRoom(request):
    client_id = request.GET.get('clientID')
    game_mode = request.GET.get('gameMode')
    if game_mode == 'pong':
        rooms = pong_rooms
    elif game_mode == 'dong':
        rooms = dong_rooms
    else:
        return Response({'error': 'Invalid game mode'}, status=400)
    for room_code, clients in rooms.items():
        if len(clients) == 1:
            if client_id in clients:
                clients.remove(client_id)
                return Response({'message': 'Client removed from room'}, status=200)
    return Response({'message': 'Client not found in any room'}, status=404)

round_1 = {}
round_2 = {}
round_3 = {}
tournament_running = False
players = []

def init_round(rounds, num):
    for x in range(num):
        code = ''.join(random.choices('0123456789', k=6))
        if code not in rounds:
            rounds[x] = {'roomID': code, 'players': []}

@api_view(['GET'])
def tournamentInit(_request):
    client_id = _request.GET.get('clientID')
    global tournament_running, players
    if tournament_running is True:
        return Response({"message": "tournament is running"}, status=400)
    if len(players) == 7:
        tournament_running = True
    if len(round_1) != 4:
        init_round(round_1, 4)
    if len(round_2) != 2:
        init_round(round_2, 2)
    if len(round_3) != 1:
        init_round(round_3, 1)
    if client_id not in players:
        players.append(client_id)
        return Response({"message": "tournament is initialized"}, status=200)
    return Response({"message": "client is already in room"}, status=400)

@api_view(['GET'])
def tournamentAssign(_request):
    global tournament_running, players
    client_id = _request.GET.get('clientID')
    if tournament_running is False:
        return Response({'message': 'tournament is not initialized'}, status=400)
    for room_code, room_data in round_1.items():
        if len(room_data['players']) < MAX_CLIENTS_PER_ROOM:
            if client_id not in players:
                break;
            room_data['players'].append(client_id)
            return Response({'roomID': room_data['roomID']})
    return Response({'message': 'tournament is full', 'players': players}, status=400)

@api_view(['DELETE'])
def tournamentLoser(_request):
    loser_id = _request.GET.get('loserID')
    removed_from_room = False

    for round_data in [round_1, round_2, round_3]:
        for room_code, room_data in round_data.items():
            if loser_id in room_data['players']:
                if room_data.get('loser_removed') is True:
                    continue  # Skip if loser has already been removed from this room
                room_data['loser_removed'] = True
                removed_from_room = True
                if loser_id in players:
                    players.remove(loser_id)
                break
        if removed_from_room:
            break
    return Response({'message': 'player removed', 'players': players}, status=200)


def round_winner(rounds):
    for p in players:
        for room_code, room_data in rounds.items():
            if len(room_data['players']) < MAX_CLIENTS_PER_ROOM:
                room_data['players'].append(p)
                break

@api_view(['GET'])
def tournamentResults(_request):
    global round_1, round_2, round_3, players

    if len(players) == 1:
        return Response({'message': players[0] + ' has won the tournament!', 'roundStatus': "end"}, status=200)
    elif len(players) == 4:
        round_winner(round_2)
    elif len(players) == 2:
        round_winner(round_3)

    result = {}
    for round_data in [round_1, round_2, round_3]:
        for key, value in round_data.items():
            result[len(result)] = value
    return Response({'message': 'tournament is running', 'results': result}, status=200)

@api_view(['DELETE'])
def tournamentEnd(_request):
    global round_1, round_2, round_3, tournament_running, players
    round_1.clear()
    round_2.clear()
    round_3.clear()
    tournament_running = False
    players.clear()
    return Response({'message': 'game has ended'}, status=200)