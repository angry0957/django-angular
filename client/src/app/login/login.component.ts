import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import * as jwt_decode from "jwt-decode";

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	username = '';
	password = '';
	error:any = {invalid: false}

	url = "http://localhost:8000/loginUser/";

	constructor(private http:HttpClient, private router: Router, private authService: AuthService) { }

	ngOnInit() {
		let data = this.authService.getUserData()
		if(!data)
			return
		if(data.type == "lawyer")
		{
			this.router.navigate(['/editprofile-lawyer']);
		}
		this.router.navigate(['/home']);
	}

	onSubmit(f: NgForm) {
		// this.username = f.value.username;
		// this.password = f.value.password;
		let formdata = {
			'username': f.value.username,
			'password': f.value.password,
		}

		this.http.post(this.url,formdata).toPromise().then((res:any) => {
			localStorage.setItem('token',res.token)
			localStorage.setItem('data',JSON.stringify(res))
			try{
				if(res.type == 'lawyer'){
					this.router.navigate(['/editprofile-lawyer']);
				}
				else if (res.type == 'client') {
					this.authService.updateToken(res.token);
					this.router.navigate(['home']);
				}
			}
			catch(Error){
				console.log('Something Bad Hppened');
			}
		},
		(err:any)=> {
			if(err.status == 400) {
				this.error.error = "Credientials are not valid";
				this.error.invalid = true
			}
		}
		);
	}
}
