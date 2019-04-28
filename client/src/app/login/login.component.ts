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
		console.log(this.password)

		this.authService.verifyUser('ads').subscribe((data:any)=> {
			if(data.type == "lawyer")
			{
				this.router.navigate(['/editprofile-lawyer']);
			}
				this.router.navigate(['/home']);

		},
		(err) => {
			this.password = '';
			console.log(err)
		});

	}

	onSubmit(f: NgForm) {
		console.log(this.password)

		this.username = f.value.username;
		this.password = f.value.password;
		let formdata = new FormData();
		formdata.append('username', f.value.username);
		formdata.append('password', f.value.password);

		this.http.post(this.url,formdata).toPromise().then((res:any) => {
			localStorage.setItem('token',res.token)
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
