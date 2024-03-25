from rest_framework.response import Response
from rest_framework.decorators import api_view

# async wrapper for DRF
# https://forum.djangoproject.com/t/assertionerror-expected-a-response-httpresponse-or-httpstreamingresponse-to-be-returned-from-the-view-but-received-a-class-coroutine/22326
# https://github.com/em1208/adrf
# from adrf.decorators import api_view

from backend.ai import GameAI
import threading
import asyncio

threads = {}

def start_game_ai_in_new_loop(game_ai):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(game_ai.running())
    loop.close()


@api_view(['GET'])
def startGameAI(request):

    mode = request.query_params.get('mode')

    if mode is None:
        return Response({"Error": '"mode" must be included in\
query parameters'})

    game_ai = GameAI(mode=mode)

    thread = threading.Thread(target=start_game_ai_in_new_loop, args=(game_ai,))

    thread.start()
    threads[game_ai.room_id] = thread

    return Response({"Success": f"Game AI Started in room {game_ai.room_id}"})

@api_view(['DELETE'])
def stopGameAI(request):

    room_id = request.query_params.get('roomID')

    if room_id is None:
        return Response({"Error": '"roomID" must be included in the query parameters'})

    thread = threads.get(room_id)

    if thread is None:
        return Response({"Error": f"No thread with ID {room_id}"})

    # Stop the thread
    thread.join()

    return Response({"Success": f"Stopped thread with ID {room_id}"})
