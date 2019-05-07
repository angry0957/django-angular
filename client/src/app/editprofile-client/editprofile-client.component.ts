import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'
import { Router } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as jwt_decode from "jwt-decode";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editprofile-client',
  templateUrl: './editprofile-client.component.html',
  styleUrls: ['./editprofile-client.component.css']
})
export class EditprofileClientComponent implements OnInit {

	Image:ImageBitmap;
	data:any = {
		"firstname": "",
		"lastname": "",
		"city": "",
		"state": "",
		"phone_number": "",
		"image": "",
		"email": "email",
	};
	imageSrc = '';
	displayName;
	text;
	description;

	constructor(private authService: AuthService, private router: Router, private http:HttpClient) {
	}

	ngOnInit() {
		this.data = this.authService.getUserData()
			if(this.data.type == "lawyer") {
				this.router.navigate(['/']);
			}
			this.displayName = this.data.username.split('@')[0]
			this.imageSrc = "http://localhost:8000" + this.data.image
	}

	onImagePicked(event: Event) {
		const file = (event.target as HTMLInputElement).files[0];
		const reader = new FileReader();
		reader.onload = () => {
			(this.imageSrc as any) = reader.result;
			this.data.image = this.imageSrc
		};
		reader.readAsDataURL(file);
	}

	update() {
		console.log("error")
		let formdata = {
			"image": this.data.image,
			'username': this.data.username,
			'firstname': this.data.firstname,
			'lastname': this.data.lastname,
			'city': this.data.city,
			'state': this.data.state,
			'phoneNumber': this.data.phone_number,
			'email': this.data.email,
		}
		
		this.http.post("http://localhost:8000/editProfileClient/",formdata).toPromise().then((res:any) => {
				
				localStorage.setItem('data',JSON.stringify(res))
			Swal.fire({
			  position: 'top-end',
			  type: 'success',
			  title: 'Your work has been saved',
			  showConfirmButton: false,
			  timer: 1500
			})
		},
		(err:any)=> {
			console.log(err.error.Error,err);
		}
		);
	}
}
