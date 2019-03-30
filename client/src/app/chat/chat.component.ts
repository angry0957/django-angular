import { Component, OnInit } from '@angular/core';
import WebSocketInstance from './WebSocket'
import { AuthService } from '../services/auth.service';
import { Http, Response } from '@angular/http'
import { HttpClient, HttpHeaders } from '@angular/common/http';
;
import { Router } from '@angular/router'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
	msg;
	data;
  constructor(private http:HttpClient, private router: Router, private authService: AuthService) { }

  ngOnInit() {
	WebSocketInstance.connect();
  			this.waitForSocketConnection(() => {
		      WebSocketInstance.initChatUser('data.username');
		      WebSocketInstance.addCallbacks(this.setMessages.bind(this), this.addMessage.bind(this))
		      WebSocketInstance.fetchMessages('data.username');
		    });
	
  // 	this.authService.verifyUser('ads').subscribe((data:any)=> {
		// 	this.data = data
		// 	// console.log(data)
		// 	this.waitForSocketConnection(() => {
		//       WebSocketInstance.initChatUser(data.username);
		//       WebSocketInstance.addCallbacks(this.setMessages.bind(this), this.addMessage.bind(this))
		//       WebSocketInstance.fetchMessages(data.username);
		//     });
		// 	if(data.type == "lawyer")
		// 	{
		// 		this.router.navigate(['/editprofile-lawyer']);
		// 	}
		// },
		// (err) => {
		// 	console.log(err)
		// });
  		

  }


	waitForSocketConnection(callback) {
    const component = this;
    setTimeout(
      function () {
        // Check if websocket state is OPEN
        if (WebSocketInstance.state() === 1) {
          console.log("Connection is made")
          callback();
          return;
        } else {
          console.log("wait for connection...")
          component.waitForSocketConnection(callback);
        }
    }, 100); // wait 100 milisecond for the connection...
  }

  addMessage(message) {
    console.log("Mesage", message)
    // this.setState({ messages: [...this.state.messages, message]});
  }

  setMessages(messages) {
    console.log("Mesage", messages)
    // this.setState({ messages: messages.reverse()});
  }

  messageChangeHandler = (event) =>  {
    console.log(event)
  }

  sendMessageHandler = (e) => {
	const messageObject = {
	from: 'this.data.username',
	text: this.msg,
	command: 'new_message'
	};
	WebSocketInstance.sendMessage(messageObject);
    this.msg = ''
  }

}
