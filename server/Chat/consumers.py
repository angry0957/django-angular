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
from django.contrib.auth.models import User


my_group = set()
@channel_session_user_from_http
def chat_connect(message):
    message.reply_channel.send({"accept": True})
    my_group.add(message.reply_channel)
    Group("all").add(message.reply_channel)

@channel_session_user
def chat_receive(message):
    data = json.loads(message['text'])
    if not 'command' in data: 
        return
    if 'new_message' == data['command']:
        ChatMessage(message=data['text'],fromUser=User.objects.get(username=data['fromUser']),toUser=User.objects.get(username=data['toUser'])).save()
        Group("all").send({"text": json.dumps(data)})
    elif 'fetch_messages' == data['command']:
        all_msg = list()
        print(data,data['username'])
        user = User.objects.get(username=data['username'])
        sendHistory = list(ChatMessage.objects.filter(fromUser=user).values())
        receiveHistory = list(ChatMessage.objects.filter(toUser=user).values())
        count = 0
        my_dict = {}
        for obj in sendHistory:
            my_dict['message' + str(count)] = {'date': str(obj['created']), 'text': obj['message'],'fromUser': data['username'],'toUser': User.objects.get(id=obj['toUser_id']).username}
            count = count+1
        for obj in receiveHistory:
            my_dict['message' + str(count)] = {'date': str(obj['created']), 'text': obj['message'],'toUser':data['username'],'fromUser': User.objects.get(id=obj['fromUser_id']).username}
            count = count+1
        my_dict["command"] = 'fetch_messages'
        my_response = json.dumps(my_dict)
        message.reply_channel.send({"text": my_response})

def chat_disconnect(message):
    Group("all").discard(message.reply_channel)
