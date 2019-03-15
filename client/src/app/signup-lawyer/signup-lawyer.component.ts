import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as jwt_decode from "jwt-decode";
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-signup-lawyer',
  templateUrl: './signup-lawyer.component.html',
  styleUrls: ['./signup-lawyer.component.css']
})
export class SignupLawyerComponent implements OnInit {

	isLoading = true;
	username;
	password;
	data = {};
	error:any = {invalid: false}
	url = "http://localhost:8000/adduser/"

	constructor(private http:HttpClient, private authService: AuthService, private router: Router) { }

	ngOnInit() {
		this.isLoading = false;
	}

	onSubmit(f: NgForm) {
		this.error.invalid = false;
		console.log(this.data);
		let formdata = new FormData();
		formdata.append('username', f.value.username);
		formdata.append('password', f.value.password);
		formdata.append('city', f.value.city);
		formdata.append('state', f.value.state);
		formdata.append('phoneNumber', f.value.phoneNumber);
		formdata.append('hcr_number', f.value.hcr_number);
		formdata.append('buisness_address', f.value.buisness_address);
		formdata.append('LicenseIDNumber', f.value.CNIC);

		this.http.post(this.url,formdata).toPromise().then((res:any) => {
			console.log('Response',res);
			try{
				console.log(jwt_decode(res.token));
				this.authService.updateToken(res.token);
				this.router.navigate(['editprofile-lawyer']);
			}
			catch(Error){
				this.error = Error;
				this.error.invalid = true;
				console.log(Error);
			}

		},
		(err:any)=> {
			this.error = err;
			this.error.invalid = true;
			if(err.status == 501) {
				console.log("Username is Already Taken",err);
			}
			else {
				console.log(err)
			}
		}
		);
	}

}
