import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
	private token;
	private url = "http://localhost:8000/verify/";
	private messageSource = new BehaviorSubject(null);
	currentMessage = this.messageSource.asObservable();


	constructor(private http: HttpClient, public router: Router) {
		this.messageSource.next(0)
	}

	getUserData() {
		let data = JSON.parse(localStorage.getItem('data'))
		if(!data){
			this.router.navigate(['/'])
		}
		return data
	}

	verifyUser(obj) {
		let formdata = new FormData();
		formdata.append("token", localStorage.getItem('token'));
		return this.http.post(this.url,{'token': localStorage.getItem('token')});
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

	changeMessage(message: any) {
		this.messageSource.next(message);
	}
}
