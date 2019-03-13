import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'
import { Router } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as jwt_decode from "jwt-decode";
import Swal from 'sweetalert2';

@Component({
	selector: 'app-editprofile-lawyer',
	templateUrl: './editprofile-lawyer.component.html',
	styleUrls: ['./editprofile-lawyer.component.css']
})
export class EditprofileLawyerComponent implements OnInit {
	Image:ImageBitmap;
	data:any = {
		"firstname": "",
		"lastname": "",
		"city": "",
		"state": "",
		"buisness_address": "",
		"phone_number": "",
		"hcr_number": "",
		"liscence_number": "",
		"image": "",
		"email": "email",
		"about": "",
		"contact": ""
	};
	imageSrc = '';
	displayName;
	text;
	description;
	allCategories:any; 
	lawyerCategory:any;
	theCheckbox = false;

	constructor(private authService: AuthService, private router: Router, private http:HttpClient) {
	}

	ngOnInit() {

		this.http.get("http://localhost:8000/getCategories").toPromise().then((res:any) => {
			this.allCategories = res;
			for (var i = 0; i < this.allCategories.length; ++i) {
				this.allCategories[i].checked = false;
			}
		},
		(err:any)=> {
			console.log(err.error.Error,err);
		}
		);
		this.authService.verifyUser('ads').subscribe((data:any)=> {
			if(data.type == "client") {
				this.router.navigate(['/replyquestion-lawyer']);
			}
			this.data = data;
			this.displayName = this.data.username.split('@')[0]
			this.imageSrc = this.data.image
			let formdata = new FormData();
			formdata.append('username', this.data.username);
			this.http.post("http://localhost:8000/getCategoryofLawyer/",formdata).toPromise().then((res:any) => {
				this.lawyerCategory = res;
				for (var i = 0; i < this.allCategories.length; ++i) {
					for (var j = 0; j < this.lawyerCategory.length; ++j) {
						if(this.lawyerCategory[j].categoryid_id == this.allCategories[i].id ){
							this.allCategories[i].checked = true;
						}
					}
				}
			},
			(err:any)=> {
				console.log(err.error.Error,err);
			}
			);
		},
		(err) => {
			console.log("Verify erroro",err);
			this.router.navigate(['/']);
		}
		);
	}

	onImagePicked(event: Event) {
		const file = (event.target as HTMLInputElement).files[0];
		console.log(file);
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
		formdata.append('buisness_address', this.data.buisness_address);
		formdata.append('phoneNumber', this.data.phone_number);
		formdata.append('hcr_number', this.data.hcr_number);
		formdata.append('LicenseIDNumber', this.data.liscence_number);
		formdata.append('email', this.data.email);
		formdata.append('about', this.data.about);
		formdata.append('contact', this.data.contact);
		formdata.append('categories', JSON.stringify(this.allCategories));
		this.http.post("http://localhost:8000/editProfile/",formdata).toPromise().then((res:any) => {
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
	  
  logout() {
    this.authService.logout();
  }
}
