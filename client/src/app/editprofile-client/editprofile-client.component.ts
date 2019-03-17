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
		
		this.authService.verifyUser('ads').subscribe((data:any)=> {
			if(data.type == "lawyer") {
				this.router.navigate(['/']);
			}
			this.data = data;
			this.displayName = this.data.username.split('@')[0]
			this.imageSrc = this.data.image
		},
		(err) => {
			console.log("Verify erroro",err);
			this.router.navigate(['/']);
		}
		);
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
		let formdata = new FormData();
		formdata.append("image", this.data.image);
		formdata.append('username', this.data.username);
		formdata.append('firstname', this.data.firstname);
		formdata.append('lastname', this.data.lastname);
		formdata.append('city', this.data.city);
		formdata.append('state', this.data.state);
		formdata.append('phoneNumber', this.data.phone_number);
		formdata.append('email', this.data.email);
		
		this.http.post("http://localhost:8000/editProfileClient/",formdata).toPromise().then((res:any) => {
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

	updatePracticeArea(event,category){
		console.log(category,event.target.checked);
	}
}
