class Ball:
	def __init__(self, size, x, y, dx, dy):
		self.size = size
		self.width_or_height = size / 2
		self.x = x
		self.y = y
		self.dx = dx  # Velocity in the x-direction
		self.dy = dy  # Velocity in the y-direction

class Paddle:
	def __init__(self, id, height, width, x, y):
		self.id = id
		self.height = height
		self.width = width
		self.x = x
		self.y = y - (height / 2)
		self.count = 0