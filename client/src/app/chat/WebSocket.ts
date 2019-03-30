
class WebSocketService {
  socketRef = new WebSocket('ws://localhost:8000/ws/chat');

  static instance = null;
  callbacks = {};

  static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  constructor() {
  }

  connect() {
    // const path = this.API_PATH;
    // this.socketRef = new WebSocket(path);
    this.socketRef.onopen = () => {
      // console.log('WebSocket open');
    };
    this.socketRef.onmessage = e => {
      // console.log(e)
      this.socketNewMessage(e.data);
    };

    this.socketRef.onerror = (e:any) => {
      console.log(e.message);
    };
    this.socketRef.onclose = () => {
      // console.log("WebSocket closed let's reopen");
      this.connect();
    };
  }

  socketNewMessage(data) {
    // console.log(data)
    const parsedData = JSON.parse(data);
    const command = parsedData.command;
    if (Object.keys(this.callbacks).length === 0) {
      return;
    }
    if (command === 'messages') {
      this.callbacks[command](parsedData.messages);
    }
    if (command === 'new_message') {
      this.callbacks[command](parsedData.message);
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
    this.callbacks['messages'] = messagesCallback;
    this.callbacks['new_message'] = newMessageCallback;
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

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;
