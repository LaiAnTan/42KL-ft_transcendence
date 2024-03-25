from rest_framework.response import Response

# async wrapper for DRF
# https://forum.djangoproject.com/t/assertionerror-expected-a-response-httpresponse-or-httpstreamingresponse-to-be-returned-from-the-view-but-received-a-class-coroutine/22326
# https://github.com/em1208/adrf
from adrf.decorators import api_view
from backend.ai import GameAI

import asyncio



@api_view(['GET'])
async def startGameAI(request):

    mode = request.query_params.get('mode')

    if mode is None:
        return Response({"Error": '"mode" must be included in\
query parameters'})

    game_ai = GameAI(mode=mode)

    asyncio.create_task(game_ai.running())

    return Response({"Success": f"Game AI Started in room {game_ai.room_id}"})
