import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  constructor() { }
  socketRef = new WebSocket('ws://localhost:8000/ws/chat');

  connect() {
    this.socketRef.onopen = () => {
    };
    this.socketRef.onmessage = e => {
      this.socketNewMessage(e.data);
    };
    this.socketRef.onerror = (e:any) => {
      console.log(e.message);
    };
    this.socketRef.onclose = () => {
      this.connect();
    };
  }

  socketNewMessage(data) {
    // console.log(data)
    const parsedData = JSON.parse(data);
    const command = parsedData.command;
    // if (Object.keys(this.callbacks).length === 0) {
    //   return;
    // }
    if (command === 'messages') {
      // this.callbacks[command](parsedData.messages);
    }
    if (command === 'new_message') {
      // this.callbacks[command](parsedData.message);
    }
  }

  initChatUser(username) {
    // console.log("username",username)
    this.sendMessage({ command: 'init_chat', username: username });
  }

  fetchMessages(username) {
    // console.log(username)
    this.sendMessage({ command: 'fetch_messages', username: username });
  }

  newChatMessage(message) {
    // console.log(message)
    this.sendMessage({ command: 'new_message', from: message.from, text: message.text }); 
  }

  addCallbacks(messagesCallback, newMessageCallback) {
    // console.log(messagesCallback,newMessageCallback);
    // this.callbacks['messages'] = messagesCallback;
    // this.callbacks['new_message'] = newMessageCallback;
  }
  
  sendMessage(data) {
    // console.log(data)
    try {
      this.socketRef.send(JSON.stringify({ ...data }));
    }
    catch(err) {
      console.log(err.message);
    }  
  }

  state() {
    return this.socketRef.readyState;
  }

   waitForSocketConnection(callback){
    const socket = this.socketRef;
    const recursion = this.waitForSocketConnection;
    setTimeout(
      function () {
        if (socket.readyState === 1) {
          console.log("Connection is made")
          if(callback != null){
            callback();
          }
          return;

        } else {
          console.log("wait for connection...")
          recursion(callback);
        }
      }, 1); // wait 5 milisecond for the connection...
  }

}
