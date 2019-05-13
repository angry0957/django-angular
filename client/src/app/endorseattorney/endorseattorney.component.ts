import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../services/auth.service'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as jwt_decode from "jwt-decode";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-endorseattorney',
  templateUrl: './endorseattorney.component.html',
  styleUrls: ['./endorseattorney.component.css']
})
export class EndorseattorneyComponent implements OnInit {
	lawyerID;
	lawyer;
	rate:any = 4;
	data;
	toLawyer;
	displayName;
	title;
	description;
	email;
	isRecomended = "False";
	isHired = "False";


  constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute, private http:HttpClient) {
		this.data = this.authService.getUserData()
		this.activatedRoute.queryParams.subscribe((params: Params) => {
			this.toLawyer = params.name;
		});
	}

  ngOnInit() {
  	this.data = this.authService.getUserData()
	
	this.displayName = this.data.username.split('@')[0];

	}

	onRatingSet(event) {
		console.log("Event : ", event);
		this.rate = event;
	}

	onSubmit() {
		let formdata = {
			'fromLawyer': this.data.username,
			'toLawyer': this.toLawyer,
			'rate': this.rate,
			'title': this.title,
			'description': this.description,
			
			'isRecomended': this.isRecomended,
			
		}
		console.log(formdata);
		// return 
		this.http.post("http://localhost:8000/EndroseLawyer/",formdata).subscribe((res:any) => {
			this.rate = 4;
			this.title = "";
			this.description = "";
			this.isRecomended = "False"
			this.isHired = "False"
			Swal.fire({
			  position: 'top-end',
			  type: 'success',
			  title: 'Your work has been saved',
			  showConfirmButton: false,
			  timer: 1500
			})
		},
		(err) => {
			if(err.status == 201){
				Swal.fire({
				  position: 'center',
				  type: 'error',
				  title: 'You already have given the review',
				  showConfirmButton: false,
				  timer: 1500
				})
			}
			console.log("Verify erroro");
		}
		);
	}

}
