import json
import requests
import logging
import time
import random

from websockets.sync.client import connect



logger = logging.getLogger(__name__)


class GameAI:

    def __init__(self, mode="pong") -> None:

        self.id = 'AI'

        if mode in ["pong", "dong"]:
            self.mode = mode
        else:
            raise ValueError("Invalid mode specified")

        self.game_url = f"ws://localhost:8000/{self.mode}"

        self.room_id = requests.get(f"http://localhost:8000/api/matchmaking?clientID={self.id}&gameMode={self.mode}").json()['roomID']

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

        requests.delete(f"http://localhost:8000/api/closeRoom?room_code=\
{self.room_id}&gameMode={self.mode}")

    def running(self):

        self.ws = connect(self.game_url +
                          f"?roomID={self.room_id}&clientID={self.id}")

        is_game_ended = False

        while is_game_ended is False:
            start_time = time.time()

            # only poll from ws every 1 second
            while time.time() - start_time < 1:
                message = self.ws.recv()

                message_data = json.loads(message)

                if self.game_ended(message_data) is True:
                    is_game_ended = True
                    break

            response = self.decide_action(message_data)

            self.ws.send(json.dumps(response))

        self.ws.close()
        self.close_room()


if __name__ == "__main__":

    ai = GameAI(mode="pong")
    ai.running()
