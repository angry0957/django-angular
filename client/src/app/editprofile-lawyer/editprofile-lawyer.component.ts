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
		this.data = this.authService.getUserData()
		console.log(this.data)
		if(this.data.type == "client") {
			this.router.navigate(['/replyquestion-lawyer']);
		}
		this.displayName = this.data.username.split('@')[0]
		this.imageSrc = this.data.image

		this.http.get("http://localhost:8000/getCategories").toPromise().then((res:any) => {
			this.allCategories = res;
			for (var i = 0; i < this.allCategories.length; ++i) {
				this.allCategories[i].checked = false;
			}
			let formdata = {
				'username': this.data.username
			}
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
		(err:any)=> {
			console.log(err.error.Error,err);
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
		let formdata = {
		"image": this.data.image,
		'username': this.data.username,
		'firstname': this.data.firstname,
		'lastname': this.data.lastname,
		'city': this.data.city,
		'state': this.data.state,
		'buisness_address': this.data.buisness_address,
		'phoneNumber': this.data.phone_number,
		'hcr_number': this.data.hcr_number,
		'LicenseIDNumber': this.data.liscence_number,
		'email': this.data.email,
		'about': this.data.about,
		'contact': this.data.contact,
		'categories': JSON.stringify(this.allCategories)

		}
		this.http.post("http://localhost:8000/editProfile/",formdata).toPromise().then((res:any) => {
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

	updatePracticeArea(event,category){
		console.log(category,event.target.checked);
	}
}
