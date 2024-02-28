from channels.generic.websocket import AsyncJsonWebsocketConsumer
import asyncio
import json
import uuid


class Ball:
    def __init__(self, size, x, y, dx, dy):
        self.size = size
        self.x = x
        self.y = y
        self.dx = dx  # Velocity in the x-direction
        self.dy = dy  # Velocity in the y-direction

class Dong(AsyncJsonWebsocketConsumer):

    count = 0
    
    game_width = 1000
    game_height = 750
    paddle_padding = 100

    ball_start_dist = 20
    ball_speed = 10

    ball = None
    # incrementing = false
    # decrementing = false
    gameid = uuid.uuid4()

    async def connect(self):
        await self.accept()
        # gameid = self.id
        # self.run()
        asyncio.create_task(self.run())

    async def receive(self, text_data=None, bytes_data=None, **kwargs):
        if text_data == 'PING':
            await self.send('PONG')
        elif text_data == 'RUN':
            await self.increment()
        elif text_data == 'CHANGE':
            await self.decrement()

    async def increment(self):
        # self.count = 0
        # while self.count <= 10:
            # await asyncio.sleep(1)
            self.count = 1

    async def decrement(self):
        # self.count = 10
        # while self.count >= 0:
            # await self.send(str(self.count))

            # await asyncio.sleep(1)
            self.count = -1
    
    async def ball_collision(self):
        return

    async def game(self):

        self.ball.x = self.ball.x + self.ball.dx
        self.ball.y = self.ball.y + self.ball.dy

        if self.ball.y > self.game_height:
            self.ball.y = self.game_height
            self.ball.dy *= -1

        if self.ball.y < 0:
            self.ball.y = 0
            self.ball.dy *= -1

        if self.ball.x > self.game_width:
            self.ball.x = self.game_width
            self.ball.dx *= -1

        if self.ball.x < 0:
            self.ball.x = 0
            self.ball.dx *= -1

    async def wall_collision(self):
        return

    async def get_game_data(self):
        return {
            'ball_x': self.ball.x,
            'ball_y': self.ball.y
        }

    async def run(self):
        # print(self.scope)
        self.ball = Ball(size = 20, y = self.game_height / 2, x = self.paddle_padding + self.ball_start_dist, dx = self.ball_speed, dy = self.ball_speed * -1)
        while (1):
            # print ('AAA')
            await asyncio.sleep(1/60)
            await self.game()
            await self.send_json(await self.get_game_data())
            self.count = 0
            # await self.update(player1.count)
            # await self.update(player2.count)
            # player1.count = 0
            # player2.count = 0
            # await self.send(get_game_data())

    async def update(player):
        # if (player.count > 0):
        #     player.paddley += SPEED
        # if (player.count < 0):
        #     player.paddley -= SPEED

        return




