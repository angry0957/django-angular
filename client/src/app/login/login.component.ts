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
	url = "http://localhost:8000/loginUser/";

	constructor(private http:HttpClient, private router: Router, private authService: AuthService) { }

	ngOnInit() {
		this.authService.verifyUser('ads').subscribe((data:any)=> {
			if(data.type == "lawyer")
			{
				this.router.navigate(['/editprofile-lawyer']);
			}
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
		this.username = f.value.username;
		this.password = f.value.password;
		let formdata = new FormData();
		formdata.append('username', f.value.username);
		formdata.append('password', f.value.password);

		console.log('Inside ',this.username,this.password)
	
		this.http.post(this.url,formdata).toPromise().then((res:any) => {
			console.log('Response',res);
			localStorage.setItem('token',res.token)
			try{
				if(res.type == 'lawyer'){
					console.log('type',res.type )
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
			if(err.status == 400) {
				console.log("Credientials are not valid",err);
			}
		}
		);
	}

}
