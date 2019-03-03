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
	username;
	password;
	url = "http://localhost:8000/auth-jwt/";

	constructor(private http:HttpClient, private router: Router, private authService: AuthService) { }

	ngOnInit() {
		this.authService.verifyUser('ads').subscribe((data)=> {
			console.log("Verify success",data);
			this.router.navigate(['/home']);
		},
		(err) => {
		});
	}

	login() {
		console.log(this.username,this.password)
	}

	onSubmit(f: NgForm) {
		console.log(f.value.username,f.value.password);
		this.username = f.value.username;
		this.password = f.value.password;
		console.log(f.valid);
		let obj ={
			'Accept': 'application/json',
			username: this.username,
			password: this.password
		}

		let headers = new HttpHeaders({
			'Accept': 'application/json',
		});

		this.http.post(this.url,obj).toPromise().then((res:any) => {
			console.log('Response',res);
			try{
		        console.log(jwt_decode(res.token));
		        this.authService.updateToken(res.token);
		        this.router.navigate(['home']);
		    }
		    catch(Error){
		        console.log('null');
		    }

		},
		(err:any)=> {
			if(err.status == 400) {
				console.log("Credientials are not valid",err);
			}
		}
		);
	}

}
