import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../services/auth.service'
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
			this.data = this.authService.getUserData();
			this.displayName = this.data.username.split('@')[0]

		this.http.post("http://localhost:8000/getLawyerById/",{'lawyerid': this.lawyerID}).subscribe((lawyer:any) => {
			lawyer.image = "http://localhost:8000/media/" + lawyer.image
			this.lawyer = lawyer;
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
		this.router.navigate(["/ratelawyer"], { queryParams: { "id": this.lawyerID } })
	}


		save(){
			let id = {
				'lawyer': this.lawyername,
				'client': this.data.username
			}

			this.http.post("http://localhost:8000/addSaved/",id).subscribe((data:any) => {
				this.router.navigate(['/savedlawyers-client'])
			},
		(err:any) => {
			this.router.navigate(['/savedlawyers-client'])
		});

		}

	}
