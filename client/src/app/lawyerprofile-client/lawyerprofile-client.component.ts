import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../services/auth.service'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Chooselawyer } from '../models/ChooseLawyer';
import * as jwt_decode from "jwt-decode";
import {NgbTabsetConfig} from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';
import WebSocketInstance from '../chat/WebSocket'

@Component({
	selector: 'app-lawyerprofile-client',
	templateUrl: './lawyerprofile-client.component.html',
	styleUrls: ['./lawyerprofile-client.component.css'],
	providers: [NgbTabsetConfig] // add NgbTabsetConfig to the component providers
})
export class LawyerprofileClientComponent implements OnInit {
	lawyerID;
	lawyername;
	lawyer;
	msg;
	data;
	displayName;
	history = [];


	constructor(config: NgbTabsetConfig,private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute, private http:HttpClient) {
		this.activatedRoute.queryParams.subscribe((params: Params) => {
			this.lawyerID = params.id;
			this.lawyername = params.name;

		});
	}

	openChatBox(){
		console.log("clicked");
		$('#live-chat').fadeIn(300);
		$('.chat').slideDown(300, 'swing');
	}

	ngOnInit() {
		this.authService.verifyUser('ads').subscribe((data:any)=> {
			WebSocketInstance.connect();
			this.data = data;
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
		let id = new FormData();
		id.append('lawyerid', this.lawyerID);

		this.http.post("http://localhost:8000/getLawyerById/",id).subscribe((lawyer:any) => {
			lawyer.image = "http://localhost:8000/media/" + lawyer.image
			this.lawyer = lawyer;
			console.log(this.lawyer);
		});

		(function() {
			$('#live-chat header').on('click', function() {
				$('.chat').slideToggle(300, 'swing');
				$('.chat-message-counter').fadeToggle(300, 'swing');
			});
			$('.chat-close').on('click', function(e) {
				e.preventDefault();
				$('#live-chat').fadeOut(300);
			});
		}) ();
	}

	review() {
		console.log("Buhaha")
		this.router.navigate(["/ratelawyer"], { queryParams: { "id": this.lawyerID } })
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
			// Turn your strings into dates, and then subtract them
			// to get a value that is either negative, positive, or zero.
			return a.date - b.date;
		});
		// this.history.sort(function(o1,o2){
			//   if (o1['date'] < o2['date'])    return -1;
			//   else if(o1['date'] > o2['date']) return  1;
			//   else                      return  0;
			// });
			console.log(this.history)
			// console.log(this.history,this.history.length)
			// console.log("Mesage", JSON.parse(messages.message))

		}

		messageChangeHandler = (event) =>  {
			console.log(event)
		}

		sendMessageHandler = () => {
			const messageObject = {
				fromUser: this.data.username,
				text: this.msg,
				command: 'new_message',
				toUser: this.lawyer.username
			};
			WebSocketInstance.sendMessage(messageObject);
			this.msg = ''
		}

		onEnter(msg){
			console.log(msg)
			this.msg = msg
			this.sendMessageHandler()
		}

		save(){
			let id = new FormData();
			id.append('lawyer', this.lawyername);
			id.append('client', this.data.username);
			console.log(this.lawyername,this.data.username)

			this.http.post("http://localhost:8000/addSaved/",id).subscribe((data:any) => {
				this.router.navigate(['/savedlawyers-client'])
			},
		(err:any) => {
			this.router.navigate(['/savedlawyers-client'])
		});

		}

	}
