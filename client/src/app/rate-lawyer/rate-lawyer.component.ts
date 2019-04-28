import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../services/auth.service'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as jwt_decode from "jwt-decode";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rate-lawyer',
  templateUrl: './rate-lawyer.component.html',
  styleUrls: ['./rate-lawyer.component.css']
})
export class RateLawyerComponent implements OnInit {
	lawyerID;
	lawyer;
	rate:any = 4;
	data;
	displayName;
	title;
	description;
	email;
	isRecomended = "False";
	isHired = "False";


  constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute, private http:HttpClient) {
		this.activatedRoute.queryParams.subscribe((params: Params) => {
			this.lawyerID = params.id;
		});
	}

  ngOnInit() {
  	this.data = this.authService.getUserData()
	if(this.data.type == "lawyer") {
		this.router.navigate(['/replyquestion-lawyer']);
	}
	this.displayName = this.data.username.split('@')[0];

	let id = {
		'lawyerid': this.lawyerID
	}

	this.http.post("http://localhost:8000/getLawyerById/",id).subscribe((lawyer:any) => {
		lawyer.image = "http://localhost:8000/media/" + lawyer.image
		this.lawyer = lawyer;
		console.log(this.lawyer);
	});
	}

	onRatingSet(event) {
		console.log("Event : ", event);
		this.rate = event;
	}

	onSubmit() {
		let formdata = {
			'username': this.data.username,
			'lawyerusername': this.lawyer.username,
			'rate': this.rate,
			'title': this.title,
			'description': this.description,
			'email': this.email,
			'isRecomended': this.isRecomended,
			'isHired': this.isHired,
		}

		this.http.post("http://localhost:8000/RateLawyer/",formdata).subscribe((res:any) => {
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
