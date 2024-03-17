from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from . import consumers

websocket_urlpatterns = [
	path("test/", consumers.ChatConsumer.as_asgi()),
]

application = ProtocolTypeRouter(
	{
		"websocket": AuthMiddlewareStack(
			URLRouter(websocket_urlpatterns)
		),
	}
)
