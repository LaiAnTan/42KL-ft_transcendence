"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
django_asgi_app = get_asgi_application()
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from .dong_game import Dong
from .pong_game import Pong

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')

application = ProtocolTypeRouter({
	"https": django_asgi_app,
	"websocket": AuthMiddlewareStack(URLRouter([
		path('dong', Dong.as_asgi()),
		path('pong', Pong.as_asgi()),
	]))
})