from channels.generic.websocket import AsyncJsonWebsocketConsumer
import asyncio
import json
import uuid
import random

class Ball:
    def __init__(self, size, x, y, dx, dy):
        self.size = size
        self.width_or_height = size / 2
        self.x = x
        self.y = y
        self.dx = dx  # Velocity in the x-direction
        self.dy = dy  # Velocity in the y-direction

class Paddle:
    def __init__(self, height, width, x, y):
        self.height = height
        self.width = width
        self.x = x
        self.y = y - (height / 2)
        self.count = 0

class Dong(AsyncJsonWebsocketConsumer):

    count = 0
    
    game_width = 100
    game_height = 100

    ball_height_offset = 1
    ball_width_offset = 0

    paddle_speed = 10

    paddle_height = 25
    paddle_width = 2 
    paddle_padding = 5

    ball_start_dist = 5
    ball_speed = 1.0
    ball_rampup = 0.02

    ball = None
    paddle_left = None
    paddle_right = None
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
        elif text_data == 'PADDLE_LEFT_UP':
            await self.increment('LEFT')
        elif text_data == 'PADDLE_LEFT_DOWN':
            await self.decrement('LEFT')
        elif text_data == 'PADDLE_RIGHT_UP':
            await self.increment('RIGHT')
        elif text_data == 'PADDLE_RIGHT_DOWN':
            await self.decrement('RIGHT')

    async def increment(self, paddle):
        if (paddle == 'LEFT'):
            self.paddle_left.count = 1
        else:
            self.paddle_right.count = 1

    async def decrement(self, paddle):
        if (paddle == 'LEFT'):
            self.paddle_left.count = -1
        else:
            self.paddle_right.count = -1
    
    async def ball_collision(self):
        return

    async def game(self):

        self.ball.x = self.ball.x + self.ball.dx
        self.ball.y = self.ball.y + self.ball.dy

        if self.ball.y > self.game_height - self.ball.width_or_height - self.ball_height_offset:
            self.ball.y = self.game_height - self.ball.width_or_height
            self.ball.dy *= -1

        if self.ball.y < 0:
            self.ball.y = 0
            self.ball.dy *= -1

        if self.ball.x  <= self.paddle_padding + self.paddle_width and self.ball.y >= self.paddle_left.y and self.ball.y <= self.paddle_left.y + self.paddle_height:
            # hit detection left
            self.ball.dx = (abs(self.ball.dx) + self.ball_rampup) * 1
            if self.ball.dy >= 0:
                self.ball.dy += self.ball_rampup + random.uniform(-0.799, 0.801)
            if self.ball.dy < 0:
                self.ball.dy -= self.ball_rampup + random.uniform(-0.799, 0.801)

        if self.ball.x  >= self.game_width - self.paddle_padding - self.paddle_width and self.ball.y >= self.paddle_right.y and self.ball.y <= self.paddle_right.y + self.paddle_height:
            # hit detection right
            self.ball.dx = (abs(self.ball.dx) + self.ball_rampup) * -1
            if self.ball.dy >= 0:
                self.ball.dy += self.ball_rampup + random.uniform(-0.799, 0.801)
            if self.ball.dy < 0:
                self.ball.dy -= self.ball_rampup + random.uniform(-0.799, 0.801)
            

        if self.ball.x > self.game_width - self.ball.width_or_height - self.ball_width_offset:
            self.ball.x = self.game_width - self.ball.width_or_height
            self.ball.dx = (abs(self.ball.dx) + self.ball_rampup) * -1
            if self.ball.dy >= 0:
                self.ball.dy += self.ball_rampup + random.uniform(-0.799, 0.801)
            if self.ball.dy < 0:
                self.ball.dy -= self.ball_rampup + random.uniform(-0.799, 0.801)

        if self.ball.x < 0:
            self.ball.x = 0
            self.ball.dx = (abs(self.ball.dx) + self.ball_rampup)
            if self.ball.dy >= 0:
                self.ball.dy += self.ball_rampup + random.uniform(-0.799, 0.801)
            if self.ball.dy < 0:
                self.ball.dy -= self.ball_rampup + random.uniform(-0.799, 0.801)


    async def wall_collision(self):
        return

    async def get_game_data(self):
        return {
            'ball_x': self.ball.x,
            'ball_y': self.ball.y,
            'paddle_left_y': self.paddle_left.y,
            'paddle_right_y': self.paddle_right.y,
        }

    async def run(self):
        self.ball = Ball(size = 3, y = self.game_height / 2, x = self.paddle_padding + self.ball_start_dist, dx = self.ball_speed, dy = random.randint(-6, 6))
        self.paddle_left = Paddle(height = 25, width = 2, x = self.paddle_padding, y = 50)
        self.paddle_right = Paddle(height = 25, width = 2, x = self.game_width - self.paddle_padding, y = 50)
        while (1):
            await asyncio.sleep(1/60)
            await self.game()
            await self.update()
            await self.send_json(await self.get_game_data())

    async def update(self):

        # left paddle
        if (self.paddle_left.count > 0):
            self.paddle_left.y -= self.paddle_speed
            if (self.paddle_left.y < 0):
                self.paddle_left.y = 0

        if (self.paddle_left.count < 0):
            self.paddle_left.y += self.paddle_speed
            if (self.paddle_left.y > self.game_height - self.paddle_height):
                self.paddle_left.y = self.game_height - self.paddle_height
        self.paddle_left.count = 0


        # right padddle
        if (self.paddle_right.count > 0):
            self.paddle_right.y -= self.paddle_speed
            if (self.paddle_right.y < 0):
                self.paddle_right.y = 0

        if (self.paddle_right.count < 0):
            self.paddle_right.y += self.paddle_speed
            if (self.paddle_right.y > self.game_height - self.paddle_height):
                self.paddle_right.y = self.game_height - self.paddle_height
        self.paddle_right.count = 0




