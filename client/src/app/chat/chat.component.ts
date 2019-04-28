import { Component, OnInit } from '@angular/core';
import WebSocketInstance from './WebSocket'
import { AuthService } from '../services/auth.service';
import { Http, Response } from '@angular/http'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as jwt_decode from "jwt-decode";
import * as $ from 'jquery';
import { Router } from '@angular/router'
import {saveAs as importedSaveAs} from "file-saver";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
	msg;
	data;
  displayName;
  notify_Users = [];
  friends = [];
  result = [];
  history = [];
  selectedUser;
  search_str;

  constructor(private http:HttpClient, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.data = this.authService.getUserData()
        if(this.data.type == "lawyer") {
          this.http.get("http://localhost:8000/getClients/").toPromise().then((res:any) => {
              for (var i = 0; i < res.length; ++i) {
                res[i].image = "http://localhost:8000/media/" + res[i].image
              }
              this.friends = res;
              this.result = this.friends;
              this.selectedUser = this.friends[0].username
      
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
              this.result = this.friends;
              this.selectedUser = this.friends[0].username
          },
          (err:any)=> {
            console.log(err.error.Error,err);
          }
          );
        }

        WebSocketInstance.connect();
        this.displayName = this.data.username.split('@')[0]
        this.waitForSocketConnection(() => {
          WebSocketInstance.initChatUser(this.data.username);
          WebSocketInstance.addCallbacks(this.setMessages.bind(this), this.addMessage.bind(this))
          WebSocketInstance.fetchMessages(this.data.username);
        });
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
    if (message.fromUser != this.data.username){
      if(this.selectedUser != message.fromUser){
        this.notify_Users.push(message.fromUser)
        this.sendNotificationToHeaderComponent();
      }
    }
    console.log("Mesage", message)
    message['date'] = new Date()
    this.history.push(message)
    $(document).ready(function(){
      $('#box').val('');
    });
    $("html, body").animate({ scrollTop: $("#myID").scrollTop() }, 1000);

    // this.setState({ messages: [...this.state.messages, message]});
  }

  setMessages(messages) {
    let temp = messages;
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
  }

  messageChangeHandler = (event) =>  {
    console.log(event)
  }

  sendMessageHandler = () => {
  	const messageObject = {
    	fromUser: this.data.username,
    	text: this.msg,
    	command: 'new_message',
    	toUser: this.selectedUser
    };
  	WebSocketInstance.sendMessage(messageObject);
    this.msg = ''
  }

  onEnter(msg){
    this.msg = msg
    this.sendMessageHandler()
  }

  updateUser(user){
    this.selectedUser = user.username;
    for (let i = 0; i < this.notify_Users.length; i++) {
      if(user.username == this.notify_Users[i]){
        this.notify_Users.splice(i,1);
      }
    }
    this.sendNotificationToHeaderComponent();
    
  }


  downloadChat(){
    let formdata = {
    }
    if (this.data.type == 'lawyer') {
      formdata['lawyer'] = this.data.username
      formdata['client'] = this.selectedUser
    }
    else {
      formdata['client'] = this.data.username
      formdata['lawyer'] = this.selectedUser
    }
  
    this.http.post("http://localhost:8000/getChat/",formdata,{responseType: "blob", headers: {'Accept': 'application/pdf'}}).toPromise().then((res:any) => {
      importedSaveAs(res, "Chat.pdf");
    (err:any)=> {
      console.log(err);
    }
  });
  }

  sendNotificationToHeaderComponent(){
    this.authService.changeMessage(this.notify_Users.length);
  }

  checkNoitfy(friend){
    for (let i = 0; i < this.notify_Users.length; i++) {
      if(friend.username == this.notify_Users[i])
        return true;
    }
    return false;
  }

  search(){
    this.selectedUser = '';
    let temp = []
    for(let i =0;i<this.result.length;i++){
      if(this.result[i].username.includes(this.search_str)){
        temp.push(this.result[i])
      }
    }
    console.log(temp)
    this.friends = temp
    if (this.friends.length > 0){
      this.selectedUser = this.friends[0].username
    }
    else {
      this.selectedUser = null
    }

  }
}
