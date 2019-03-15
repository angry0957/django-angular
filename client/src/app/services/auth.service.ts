import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
	private token;
	private url = "http://localhost:8000/verify/";

	constructor(private http: HttpClient, public router: Router) {

	}

	verifyUser(obj) {
		let formdata = new FormData();
		formdata.append("token", localStorage.getItem('token'));
		return this.http.post(this.url,formdata);
	}

	updateToken(obj){
		this.token = obj;
        localStorage.setItem('token',this.token);
	}

	logout() {
		this.token = null;
		localStorage.setItem('token',null);
		this.router.navigate(['/']);
	}
}
