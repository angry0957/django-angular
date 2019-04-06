import { Component, OnInit } from '@angular/core';
import WebSocketInstance from './WebSocket'
import { AuthService } from '../services/auth.service';
import { Http, Response } from '@angular/http'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as jwt_decode from "jwt-decode";
import { Router } from '@angular/router'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
	msg;
	data;
  displayName;
  friends = [];
  history = [];
  constructor(private http:HttpClient, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.authService.verifyUser('ads').subscribe((data:any)=> {
        if(data.type == "lawyer") {
          this.http.get("http://localhost:8000/getClients/").toPromise().then((res:any) => {
              for (var i = 0; i < res.length; ++i) {
                res[i].image = "http://localhost:8000/media/" + res[i].image
              }
              this.friends = res;
      
          },
          (err:any)=> {
            console.log(err.error.Error,err);
          }
          );
        }
        else{
          this.http.get("http://localhost:8000/getLawyers/").toPromise().then((res:any) => {
              for (var i = 0; i < res.length; ++i) {
                res[i].image = "http://localhost:8000/media/" + res[i].image
              }
              this.friends = res;
          },
          (err:any)=> {
            console.log(err.error.Error,err);
          }
          );
        }


        WebSocketInstance.connect();
        this.data = jwt_decode(data.token);
        this.displayName = this.data.username.split('@')[0]
        this.waitForSocketConnection(() => {
          WebSocketInstance.initChatUser(this.data.username);
          WebSocketInstance.addCallbacks(this.setMessages.bind(this), this.addMessage.bind(this))
          WebSocketInstance.fetchMessages(this.data.username);
        });
    },
    (err) => {
      console.log("Verify erroro",err);
      this.router.navigate(['/']);
    }
  );
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
    message['date'] = new Date()

    this.history.push(message)
    // this.setState({ messages: [...this.state.messages, message]});
  }

  setMessages(messages) {
    let temp = messages;
    console.log(temp);
    let count = 0

    for(let i=1;i>0;){
      if (temp.hasOwnProperty("message" + count.toString())) {
        temp["message" + count.toString()]['date'] = new Date(temp["message" + count]['date'])
        this.history[count] = temp["message" + count.toString()]
      }
      else{
        break;
      }
      count++;
    }
    this.history.sort(function(a:any,b:any){
      return a.date - b.date;
    });
    console.log(this.history)
  }

  messageChangeHandler = (event) =>  {
    console.log(event)
  }

  sendMessageHandler = () => {
	const messageObject = {
	fromUser: this.data.username,
	text: this.msg,
	command: 'new_message',
	toUser: 'user8@gmail.com'
  };
	WebSocketInstance.sendMessage(messageObject);
    this.msg = ''
  }

  onEnter(msg){
    console.log(msg)
    this.msg = msg
    this.sendMessageHandler()
  }
}
