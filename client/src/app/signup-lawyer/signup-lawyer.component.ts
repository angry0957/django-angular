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
		
		let formdata = {
			'username': f.value.username,
			'password': f.value.password,
			'city': f.value.city,
			'state': f.value.state,
			'phoneNumber': f.value.phoneNumber,
			'hcr_number': f.value.hcr_number,
			'buisness_address': f.value.buisness_address,
			'LicenseIDNumber': f.value.CNIC,
		}
		console.log(formdata);

		this.http.post(this.url,formdata).toPromise().then((res:any) => {
			console.log('Response',res);
			try{
				localStorage.setItem('token',res.token)
				localStorage.setItem('data',JSON.stringify(res))
				this.router.navigate(['home']);
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
