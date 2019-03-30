# from channels.auth import AuthMiddlewareStack
from django.conf.urls import url
from . import consumers
from channels.routing import route

# from channels.routing import ProtocolTypeRouter, URLRouter
import re

websocket_urlpatterns = [
    route('websocket.connect', consumers.chat_connect),
    route('websocket.disconnect', consumers.chat_disconnect),
    route('websocket.receive', consumers.chat_receive),
]

# application = ProtocolTypeRouter({
#     'websocket': AuthMiddlewareStack(
#         URLRouter(
#             websocket_urlpatterns
#         )
#     ),
# })
