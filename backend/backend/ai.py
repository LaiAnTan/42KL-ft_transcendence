import json
import requests
import logging
import time
import random
import ssl
import asyncio

from websockets.client import connect

logger = logging.getLogger(__name__)


class GameAI:

    def __init__(self, mode="pong") -> None:

        self.id = 'AI'

        if mode in ["pong", "dong"]:
            self.mode = mode
        else:
            raise ValueError("Invalid mode specified")

        self.game_url = f"wss://localhost:8001/{self.mode}"

        self.room_id = requests.get(f"https://localhost:8000/api/matchmaking\
?clientID={self.id}&gameMode={self.mode}", verify='/etc/certs/cert.pem')\
            .json()['roomID']

        print(self.room_id)

        self.up_response = {
            'id': self.id,
            'direction': 'PADDLE_UP'
        }

        self.down_response = {
            'id': self.id,
            'direction': 'PADDLE_DOWN'
        }

        self.stop_response = {
            'id': self.id,
            'direction': 'PADDLE_STOP'
        }

        self.ssl_context = ssl.create_default_context()
        self.ssl_context.load_verify_locations('/etc/certs/cert.pem')

    def game_ended(self, message_data):

        try:
            _ = message_data['room_id']
            _ = message_data['player_1_id']
            _ = message_data['player_2_id']
            _ = message_data['match_type']
        except KeyError:
            return False

        return True

    def decide_action(self, game_data):

        print(game_data)

        return self.up_response if random.randint(1, 2) == 1 else \
            self.down_response

    def close_room(self):

        requests.delete(f"https://localhost:8000/api/closeRoom?room_code=\
{self.room_id}&gameMode={self.mode}",
                        verify='/etc/certs/cert.pem')

    async def running(self):

        async with connect(self.game_url +
                           f"?roomID={self.room_id}&clientID={self.id}",
                           ssl=self.ssl_context) as websocket:

            self.ws = websocket
            is_game_ended = False

            while is_game_ended is False:
                start_time = time.time()

                # only poll from ws every 1 second
                while time.time() - start_time < 1:
                    message = await self.ws.recv()

                    message_data = json.loads(message)

                    if self.game_ended(message_data) is True:
                        is_game_ended = True
                        break

                response = self.decide_action(message_data)

                await self.ws.send(json.dumps(response))

            await self.ws.close()
            self.close_room()


if __name__ == "__main__":

    ai = GameAI(mode="pong")
    asyncio.run(ai.running())
