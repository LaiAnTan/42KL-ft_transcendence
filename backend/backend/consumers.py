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

    rooms = {}

    async def connect(self):
        self.room_id = self.scope['query_string'].decode('utf-8').split('=')[1]
        self.room_group_name = f"room_{self.room_id}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        if self.room_id not in self.rooms:
            # Initialize the room with game-related variables
            self.rooms[self.room_id] = {
                'game_started': False,
                'paddle_left': Paddle(height=25, width=2, x=self.paddle_padding, y=50),  # Example initialization
                'paddle_right': Paddle(height=25, width=2, x=self.game_width - self.paddle_padding, y=50),  # Example initialization
                'number_in_room': 0,
                'ball': Ball(size=2, x=self.game_width / 2, y=self.game_height / 2, dx=1.0, dy=random.randint(-4, 4))  # Example initialization
            }

        self.rooms[self.room_id]['number_in_room'] += 1

        if self.rooms[self.room_id]['number_in_room'] == 2:
            asyncio.create_task(self.run())
    
        await self.accept()

    async def disconnect(self, close_code):
        self.rooms[self.room_id]['number_in_room'] -= 1
        self.rooms[self.room_id]['game_started'] = False
        if self.rooms[self.room_id]['number_in_room'] == 0:
            del self.rooms[self.room_id]

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data=None, bytes_data=None, **kwargs):
        if text_data == 'PING':
            await self.send_json({'message': 'PONG'})
        elif text_data == 'USERS':
            await self.send_json({'message': self.rooms[self.room_id], 'room_id': self.room_id})
        elif text_data == 'PADDLE_LEFT_UP':
            await self.increment('LEFT')
        elif text_data == 'PADDLE_LEFT_DOWN':
            await self.decrement('LEFT')
        elif text_data == 'PADDLE_RIGHT_UP':
            await self.increment('RIGHT')
        elif text_data == 'PADDLE_RIGHT_DOWN':
            await self.decrement('RIGHT')

    async def increment(self, paddle):
        await self.send_json({'message': 'increment'})
        if paddle == 'LEFT':
            self.rooms[self.room_id]['paddle_left'].count = 1
        else:
            self.rooms[self.room_id]['paddle_right'].count = 1

    async def decrement(self, paddle):
        if paddle == 'LEFT':
            self.rooms[self.room_id]['paddle_left'].count = -1
        else:
            self.rooms[self.room_id]['paddle_right'].count = -1
    
    async def resetball(self, side):

        if side == "LEFT":
            room = self.rooms[self.room_id]
            room['ball'].y = self.game_height / 2
            room['ball'].x = self.paddle_padding + self.ball_start_dist
            room['ball'].dx = self.ball_speed
            room['ball'].dy = random.randint(-4, 4)
        
        if side == "RIGHT":
            room = self.rooms[self.room_id]
            room['ball'].y = self.game_height / 2
            room['ball'].x = self.game_width - self.ball_start_dist - self.paddle_padding - self.paddle_width
            room['ball'].dx = self.ball_speed * -1
            room['ball'].dy = random.randint(-4, 4)

        await asyncio.sleep(1)

    async def get_game_data(self):
        room = self.rooms[self.room_id]
        return {
            'ball_x': room['ball'].x if room['ball'] else None,
            'ball_y': room['ball'].y if room['ball'] else None,
            'paddle_left_y': room['paddle_left'].y,    
            'paddle_right_y': room['paddle_right'].y,
        }

    async def run(self):
        room = self.rooms[self.room_id]
        room['game_started'] = True

        while room['game_started']:
            await asyncio.sleep(1 / 60)
            await self.game()
            await self.update()
            await self.channel_layer.group_send(
                self.room_group_name, {
                    'type': 'game_data',
                    'message': await self.get_game_data()
                }
            )

    async def game_data(self, event):
        message = event['message']
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'send_game_data',
                'message': message
            }
        )

    async def send_game_data(self, event):
        message = event['message']
        await self.send_json(message)

    async def game(self):
        room = self.rooms[self.room_id]
        room['ball'].x = room['ball'].x + room['ball'].dx
        room['ball'].y = room['ball'].y + room['ball'].dy

        if room['ball'].y > self.game_height - self.ball_height_offset:
            room['ball'].y = self.game_height - self.ball_height_offset
            room['ball'].dy *= -1

        if room['ball'].y < 0:
            room['ball'].y = 0
            room['ball'].dy *= -1

        if (room['ball'].x  < self.paddle_padding and 
            room['ball'].x > self.paddle_padding - self.paddle_width and 
            room['ball'].y > room['paddle_left'].y and 
            room['ball'].y < room['paddle_left'].y + self.paddle_height):
            await self.send("HIT LEFT")
            await self.resetball("LEFT")

        if (room['ball'].x  > self.game_width - self.paddle_padding - self.paddle_width and 
            room['ball'].x < self.game_width - self.paddle_padding + self.paddle_width and 
            room['ball'].y > room['paddle_right'].y and 
            room['ball'].y < room['paddle_right'].y + self.paddle_height):
            await self.send("HIT RIGHT")
            await self.resetball("RIGHT")

        if room['ball'].x > self.game_width - room['ball'].width_or_height - self.ball_width_offset:
            room['ball'].x = self.game_width - room['ball'].width_or_height
            room['ball'].dx = (abs(room['ball'].dx) + self.ball_rampup) * -1
            if room['ball'].dy >= 0:
                room['ball'].dy += self.ball_rampup + random.uniform(-0.499, 0.501)
            if room['ball'].dy < 0:
                room['ball'].dy -= self.ball_rampup + random.uniform(-0.499, 0.501)

        if room['ball'].x < 0:
            room['ball'].x = 0
            room['ball'].dx = (abs(room['ball'].dx) + self.ball_rampup)
            if room['ball'].dy >= 0:
                room['ball'].dy += self.ball_rampup + random.uniform(-0.499, 0.501)
            if room['ball'].dy < 0:
                room['ball'].dy -= self.ball_rampup + random.uniform(-0.499, 0.501)

    async def update(self):

        room = self.rooms[self.room_id]
        # left paddle
        if room['paddle_left'].count > 0:
            room['paddle_left'].y -= self.paddle_speed
            if room['paddle_left'].y < 0:
                room['paddle_left'].y = 0

        if room['paddle_left'].count < 0:
            room['paddle_left'].y += self.paddle_speed
            if room['paddle_left'].y > self.game_height - self.paddle_height:
                room['paddle_left'].y = self.game_height - self.paddle_height
        room['paddle_left'].count = 0

        # right padddle
        if room['paddle_right'].count > 0:
            room['paddle_right'].y -= self.paddle_speed
            if room['paddle_right'].y < 0:
                room['paddle_right'].y = 0

        if room['paddle_right'].count < 0:
            room['paddle_right'].y += self.paddle_speed
            if room['paddle_right'].y > self.game_height - self.paddle_height:
                room['paddle_right'].y = self.game_height - self.paddle_height
        room['paddle_right'].count = 0