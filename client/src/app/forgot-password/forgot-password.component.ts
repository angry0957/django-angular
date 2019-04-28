import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import * as jwt_decode from "jwt-decode";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
	password;
	code;
	mail;
	show = 1;
	err;

  	constructor(private http:HttpClient, private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }

  sendMail(){
  	console.log(this.mail);
  	let formdata = {
	  	"mail":this.mail
  	}
	this.http.post("http://localhost:8000/testmany/",formdata).toPromise().then((res:any) => {
		console.log('Response',res);
	  	this.show = 2;
	  	this.err = ""
	},
	(err:any)=> {
		console.log(err)
		this.err = err;
	})
  }

  sendCode(){
  	console.log(this.code);
  	let formdata = {
	  	"mail": this.mail,
	  	"code": this.code
  	}
	this.http.post("http://localhost:8000/verifyCode/",formdata).toPromise().then((res:any) => {
		console.log('Response',res);
	  	this.show = 3;
	},
	(err:any)=> {
		this.err = err;
		console.log("Credientials are not valid",err);
	})
  }

  updatePassword(){
  	console.log(this.password);
  	let formdata = {
	  	"mail": this.mail,
	  	"password": this.password
  	}
	this.http.post("http://localhost:8000/updatePassword/",formdata).toPromise().then((res:any) => {
		this.login();
	},
	(err:any)=> {
		this.err = err;
	})
  }

	login() {
		let formdata = {
			'username': this.mail,
			'password': this.password
		}

		this.http.post("http://localhost:8000/loginUser/",formdata).toPromise().then((res:any) => {
			console.log('Response',res);
			localStorage.setItem('token',res.token)
			try{
				if(res.type == 'lawyer'){
					this.router.navigate(['/editprofile-lawyer']);
				}
				else if (res.type == 'client') {
					console.log(jwt_decode(res.token));
					this.authService.updateToken(res.token);
					this.router.navigate(['home']);
				}
			}
			catch(Error){
				console.log('Something Bad Hppened');
			}
		},
		(err:any)=> {
			this.err = err;
		}
		);
	}

}
