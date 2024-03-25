import json
import requests
import logging
import time
import ssl
import asyncio

from websockets.client import connect

logger = logging.getLogger(__name__)


class GameAI:

    LEFT_PADDLE_X = 3
    RIGHT_PADDLE_X = 97
    TOP_WALL_Y = 0
    BOTTOM_WALL_Y = 100
    HALF_PADDLE_HEIGHT = 13.5
    PADDLE_HEIGHT = 25
    MAX_BOUNCES = 5
    WS_POLL_SPEED = 1
    PADDLE_MOVE_RATE = 0.005

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

        logger.info(f"Room ID: {self.room_id}")
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

        self.prev = None
        self.curr = None

    def game_ended(self, message_data):

        try:
            _ = message_data['room_id']
            _ = message_data['player_1_id']
            _ = message_data['player_2_id']
            _ = message_data['match_type']
        except KeyError:
            return False

        return True

    def predict_bounce(self, m, c, paddle_x):

        max_bounces = self.MAX_BOUNCES
        while max_bounces:

            predicted_y = m * paddle_x + c

            # predicted in range of playable area
            if predicted_y > self.TOP_WALL_Y and \
                    predicted_y < self.BOTTOM_WALL_Y:
                break

            # predicted above playable area
            if m > 0 and predicted_y < self.TOP_WALL_Y:
                bounce_x = (self.TOP_WALL_Y - c) / m
                m = -m  # change direction
                c = self.TOP_WALL_Y - m * bounce_x

            # predicted below playable area
            elif m < 0 and predicted_y > self.BOTTOM_WALL_Y:
                bounce_x = (self.BOTTOM_WALL_Y - c) / m
                m = -m  # change direction
                c = self.BOTTOM_WALL_Y - m * bounce_x

            max_bounces -= 1

        return m, c, predicted_y

    async def decide_action(self, game_data):
        
        logger.info(game_data)

        if ('hit', 'HIT LEFT') in game_data.items() or \
                ('hit', 'HIT RIGHT') in game_data.items():
            return None, None

        self.prev = self.curr
        self.curr = (game_data['ball_x'], game_data['ball_y'])

        paddle_right_y = game_data['paddle_right_y'] + self.HALF_PADDLE_HEIGHT

        if self.prev is None:
            return None, None

        # find initial line
        if (self.curr[0] - self.prev[0]) != 0:
            m = (self.curr[1] - self.prev[1]) / (self.curr[0] - self.prev[0])
        else:
            m = 0

        c = self.curr[1] - (m * self.curr[0])

        # ball moving towards player
        if self.curr[0] - self.prev[0] < 0:

            # calculate new trajectory assuming player hits the ball
            player_hit_y = m * self.LEFT_PADDLE_X + c

            # print(f"will hit player at {player_hit_y}")

            m = -m
            c = player_hit_y - m * self.LEFT_PADDLE_X

            if player_hit_y < self.TOP_WALL_Y or \
                    player_hit_y > self.BOTTOM_WALL_Y:
                # predict bounce towards player
                m, c, _ = self.predict_bounce(-m, player_hit_y,
                                              self.LEFT_PADDLE_X)

        # predict bounce towards AI
        _, _, predicted_y = self.predict_bounce(m, c, self.RIGHT_PADDLE_X)

        print(f"will hit ai at: {predicted_y}")

        # in seconds
        interval = (abs(predicted_y - paddle_right_y) +
                    self.HALF_PADDLE_HEIGHT) * self.PADDLE_MOVE_RATE

        # # tolerance for the paddle to stop twitching
        if abs(predicted_y - paddle_right_y) > (self.HALF_PADDLE_HEIGHT - 5):

            if predicted_y < paddle_right_y and predicted_y > self.TOP_WALL_Y:
                print(f"move up {interval} seconds")
                return self.up_response, interval
            elif predicted_y > paddle_right_y and \
                    predicted_y < self.BOTTOM_WALL_Y:
                print(f"move down {interval} seconds")
                return self.down_response, interval

        return None, None

    def close_room(self):

        requests.delete(f"https://localhost:8000/api/closeRoom?room_code=\
{self.room_id}&gameMode={self.mode}",
                        verify='/etc/certs/cert.pem')

    async def send_action(self, response, interval):

        await self.ws.send(json.dumps(response))

        await asyncio.sleep(interval)

        await self.ws.send(json.dumps(self.stop_response))

    async def running(self):

        async with connect(self.game_url +
                           f"?roomID={self.room_id}&clientID={self.id}",
                           ssl=self.ssl_context) as websocket:

            self.ws = websocket

            while True:
                start_time = time.time()

                # only poll from ws in intervals
                if time.time() - start_time > self.WS_POLL_SPEED:
                    message = await self.ws.recv()

                    message_data = json.loads(message)

                    if self.game_ended(message_data) is True:
                        break

                if message_data is not None:

                    response, interval = await asyncio.create_task(
                                            self.decide_action(message_data))

                if response is not None:

                    asyncio.create_task(self.send_action(response, interval))

            logger.info("game ended")

            await self.ws.close()
            self.close_room()


if __name__ == "__main__":

    ai = GameAI(mode="pong")
    asyncio.run(ai.running())
