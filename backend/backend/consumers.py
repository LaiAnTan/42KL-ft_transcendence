from channels.generic.websocket import AsyncJsonWebsocketConsumer
import asyncio

class PracticeConsumer(AsyncJsonWebsocketConsumer):

    count = 0

    async def connect(self):
        await self.accept()

    async def receive(self, text_data=None, bytes_data=None, **kwargs):
        if text_data == 'PING':
            await self.send('PONG')
        elif text_data == 'RUN':
            await self.increment()
        elif text_data == 'CHANGE':
            await self.decrement()

    async def increment(self):
        self.count = 0
        while self.count <= 10:
            await self.send(str(self.count))
            await asyncio.sleep(1)
            self.count += 1

    async def decrement(self):
        self.count = 10
        while self.count >= 0:
            await self.send(str(self.count))
            await asyncio.sleep(1)
            self.count -= 1
