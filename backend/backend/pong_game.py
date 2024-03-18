from channels.generic.websocket import AsyncJsonWebsocketConsumer
import urllib.parse
import asyncio
import json
import uuid
import random
from .game_utils import Ball
from .game_utils import Paddle

class Pong(AsyncJsonWebsocketConsumer):

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
    points_to_win = 10

    rooms = {}

    async def connect(self):
        query_string = self.scope.get("query_string", b"").decode("utf-8")
        query_parameters = urllib.parse.parse_qs(query_string)

        self.room_id = query_parameters.get('roomID', [''])[0]
        self.client_id = query_parameters.get('clientID', [''])[0]
        self.room_group_name = f"room_{self.room_id}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        if self.room_id not in self.rooms:
            # Initialize the room with game-related variables
            self.rooms[self.room_id] = {
                'game_started': False,
                'paddle_left': Paddle("1", height=25, width=2, x=self.paddle_padding, y=50),
                'paddle_right': Paddle("2", height=25, width=2, x=self.game_width - self.paddle_padding, y=50),
                'player_in_room': 0,
                'players': [],
            }

        self.rooms[self.room_id]['player_in_room'] += 1
        self.rooms[self.room_id]['players'].append(self.client_id)

        if self.rooms[self.room_id]['player_in_room'] > 2:
            await self.send_json({'message': 'ROOM FULL'})
            self.rooms[self.room_id]['player_in_room'] -= 1
            await self.close()
            return

        await self.accept()

    async def disconnect(self, close_code):
        self.rooms[self.room_id]['player_in_room'] -= 1
        self.rooms[self.room_id]['game_started'] = False
        self.rooms[self.room_id]['players'].remove(self.client_id)
        if self.rooms[self.room_id]['player_in_room'] == 0:
            del self.rooms[self.room_id]

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data=None, bytes_data=None, **kwargs):
        data = json.loads(text_data)

        if 'command' in data:
            if data['command'] == 'START_GAME':
                if self.rooms[self.room_id]['player_in_room'] == 2:
                    asyncio.create_task(self.run())
                else:
                    await self.send_json({'console': 'WAITING FOR PLAYER TO JOIN'})
            elif data['command'] == 'USERS':
                await self.send_json({'message': self.rooms[self.room_id], 'room_id': self.room_id})

        elif (data['id'] == self.rooms[self.room_id]["paddle_left"].id):
            if (data['direction'] == "PADDLE_UP"):
                self.rooms[self.room_id]["paddle_left"].count = 1
            elif (data['direction'] == "PADDLE_DOWN"):
                self.rooms[self.room_id]["paddle_left"].count = -1
            else:
                self.rooms[self.room_id]["paddle_left"].count = 0
            return
        
        elif (data['id'] == self.rooms[self.room_id]["paddle_right"].id):
            if (data['direction'] == "PADDLE_UP"):
                self.rooms[self.room_id]["paddle_right"].count = 1
            elif (data['direction'] == "PADDLE_DOWN"):
                self.rooms[self.room_id]["paddle_right"].count = -1
            else:
                self.rooms[self.room_id]["paddle_right"].count = 0
            return
    
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

    async def run(self):
        room = self.rooms[self.room_id]
        room['ball'] = Ball(size=3, y=self.game_height / 2, x=room['paddle_left'].x + self.ball_start_dist,
            dx=self.ball_speed, dy=random.randint(-6, 6))
        room['game_started'] = True

        while room['paddle_left'].score < self.points_to_win and room['paddle_right'].score < self.points_to_win:
            await asyncio.sleep(1 / 60)
            await self.game()
            await self.update()
            await self.channel_layer.group_send(
                self.room_group_name, {
                    'type': 'send_game_data',
                    'message': await self.get_game_data()
                }
            )
        await self.channel_layer.group_send(
                self.room_group_name, {
                    'type': 'send_game_data',
                    'message': await self.get_final_data()
                }
            )

    async def get_final_data(self):
        room = self.rooms[self.room_id]
        return {
            'room_id': self.room_id,
            'player_1': room['players'][0],
            'player_2': room['players'][1],
            'player_1_score': room['paddle_left'].score,
            'player_2_score': room['paddle_right'].score,
            'match_type': 'pong'
        }

    async def get_game_data(self):
        room = self.rooms[self.room_id]
        return {
            'ball_x': room['ball'].x if room['ball'] else None,
            'ball_y': room['ball'].y if room['ball'] else None,
            'paddle_left_y': room['paddle_left'].y,    
            'paddle_right_y': room['paddle_right'].y,
            'room_id': self.room_id,
            'players': room['players'],
        }

    async def wall_hit(self):
        await self.channel_layer.group_send(
        self.room_group_name, {
            'type': 'send_game_data',
            'message': {'hit': 'HIT WALL'}
        }
    )

    async def send_game_data(self, event):
        message = event['message']
        await self.send_json(message)

    async def game(self):
        room = self.rooms[self.room_id]
        room['ball'].x = room['ball'].x + room['ball'].dx
        room['ball'].y = room['ball'].y + room['ball'].dy

        # hit bottom wall
        if room['ball'].y > self.game_height - self.ball_height_offset:
            room['ball'].y = self.game_height - self.ball_height_offset
            room['ball'].dy *= -1
            await self.wall_hit()

        # hit top wall
        if room['ball'].y < 0:
            room['ball'].y = 0
            room['ball'].dy *= -1
            await self.wall_hit()

        # hit left paddle
        if (room['ball'].x  < self.paddle_padding and 
            room['ball'].x > self.paddle_padding - self.paddle_width and 
            room['ball'].y > room['paddle_left'].y and 
            room['ball'].y < room['paddle_left'].y + self.paddle_height):
            room['ball'].dx = (abs(room['ball'].dx) + self.ball_rampup)
            if room['paddle_left'].count > 0:
                room['ball'].dy += self.ball_rampup + random.uniform(0, 0.501)
            elif room['paddle_left'].count < 0:
                room['ball'].dy -= self.ball_rampup + random.uniform(0, 0.501)
            await self.wall_hit()

        # hit right paddle
        if (room['ball'].x  > self.game_width - self.paddle_padding - self.paddle_width and 
            room['ball'].x < self.game_width - self.paddle_padding + self.paddle_width and 
            room['ball'].y > room['paddle_right'].y and 
            room['ball'].y < room['paddle_right'].y + self.paddle_height):
            room['ball'].x = self.game_width - room['ball'].width_or_height - self.paddle_padding
            room['ball'].dx = (abs(room['ball'].dx) + self.ball_rampup) * -1
            if room['paddle_right'].count > 0:
                room['ball'].dy += self.ball_rampup + random.uniform(0, 0.501)
            elif room['paddle_right'].count < 0:
                room['ball'].dy -= self.ball_rampup + random.uniform(0, 0.501)
            await self.wall_hit()

        # hit left wall
        if room['ball'].x < 0:
            room['ball'].x = 0
            await self.channel_layer.group_send(
                self.room_group_name, {
                    'type': 'send_game_data',
                    'message': {'hit': 'HIT LEFT'}
                }
            )
            room['paddle_right'].score += 1
            await self.resetball("LEFT")

        # hit right wall
        if room['ball'].x > self.game_width - room['ball'].width_or_height - self.ball_width_offset:
            await self.channel_layer.group_send(
                self.room_group_name, {
                    'type': 'send_game_data',
                    'message': {'hit': 'HIT RIGHT'}
                }
            )
            room['paddle_left'].score += 1
            await self.resetball("RIGHT")

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