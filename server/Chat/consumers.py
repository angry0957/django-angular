from channels import Group
from channels.sessions import channel_session
from .models import ChatMessage
from django.contrib.auth.models import User
import json
from channels.auth import channel_session_user, channel_session_user_from_http
from django.utils.html import escape
from django.core import serializers
import markdown
import bleach
import re
from channels import Channel
from django.conf import settings
from django.urls import reverse

# from channels_presence.models import Room
# from channels_presence.decorators import touch_presence

# from django.dispatch import receiver
# from channels_presence.signals import presence_changed
print('INside COnsumers')
my_group = set()
@channel_session_user_from_http
def chat_connect(message):
    # print('message', message)
    message.reply_channel.send({"accept": True})
    my_group.add(message.reply_channel)
    Group("all").add(message.reply_channel)
    # Channel("all").add(message)


# @touch_presence
@channel_session_user
def chat_receive(message):
    data = json.loads(message['text'])
    if not 'command' in data: 
        return
    if 'new_message' == data['command']:    
        my_dict = {"message":data['text'],"command":"new_message"}
        Group("all").send({"text": json.dumps(my_dict)})
        return
        # Channel("all").send(data)
        for item in my_group:
            try:
                item.send({"text": json.dumps(my_dict)})
            except:
                my_group.discard(item)
                pass
    elif 'fetch_messages' == data['command']:
        message.reply_channel.send({"text": '{"message":"fetching_messages","command":"fetch_messages"}'})
    print(data)
    # if data["message"] == "fetch_messages" or data["message"] == "init_chat":
    #     return
    # if not data['message']:
    #     return

    # m = ChatMessage(username=data["username"], message=data['text'])
    # m.save()
    # my_dict = {'author' : {"username": data["username"]},"message":data['text'] , 'content' : data['text'],"command": 'new_message'}
    data['text'] = "Server working after 5 days"


# @channel_session_user
def chat_disconnect(message):
    Group("all").discard(message.reply_channel)
    # my_group.remove(message)
    # Room.objects.remove("all", message.reply_channel.name)
