import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import * as jwt_decode from "jwt-decode";

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {

	data;
	arr = [];
  constructor(private http:HttpClient, private router: Router, private authService: AuthService) { }

	ngOnInit() {

		this.authService.verifyUser('ads').subscribe((data:any)=> {
			console.log(data)
			this.data = data;
			if(data.type == "client")
			{
				this.router.navigate(['/editprofile-lawyer']);
			}
			let formdata = new FormData();
			formdata.append('username', this.data.username);
		
			this.http.post("http://localhost:8000/review/",formdata).toPromise().then((res:any) => {
				console.log('Response',res);
				this.arr = res;
			},
			(err:any)=> {
				if(err.status == 400) {
					console.log("Credientials are not valid",err);
				}
			}
			);

		},
		(err) => {
			console.log(err)
		});

	}

}
