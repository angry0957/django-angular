import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'
import { Router } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as jwt_decode from "jwt-decode";

@Component({
	selector: 'app-askedquestion-client',
	templateUrl: './askedquestion-client.component.html',
	styleUrls: ['./askedquestion-client.component.css']
})
export class AskedquestionClientComponent implements OnInit {

	data:any;
	displayName;
	text;
	description;
	askedQuestions = [];
	event;

	constructor(private authService: AuthService, private router: Router, private http:HttpClient) {
	}

	ngOnInit() {
		this.updateReply()
	}

	updateReply() {
		this.data = this.authService.getUserData()
		if(this.data.type == "lawyer") {
			this.router.navigate(['/replyquestion-lawyer']);
		}
		this.displayName = this.data.username.split('@')[0];
		let formdata = {
			'username': this.data.username
		}

		this.http.post("http://localhost:8000/askedquestion/",formdata).toPromise().then((res:any) => {
			this.askedQuestions = res;
			for (let i = 0; i < res.length; ++i) {
				let parameter = {
					'question': res[i].id
				}
				this.http.post("http://localhost:8000/getreply/",parameter).subscribe((reply:any) => {
					this.askedQuestions[i]['replys'] = reply;
				},
				(err:any)=> {
					console.log(err.error.Error,err);
				}
				);
			}
		},
		(err:any)=> {
			console.log(err.error.Error,err);
		}
		);
	}

	reply(question) {
		let parameter = {
			'question': question,
			'username': this.data.username,
			'text': this.text,
		}
		this.http.post("http://localhost:8000/replyquestion/",parameter).toPromise().then((reply:any) => {
			this.text = ""
			this.event.target.value = ""
			// this.updateReply()
		});
	}

	onKey($event){
		this.event = event;
		this.text = event.target['value'];
	}

}
