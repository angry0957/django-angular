import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'
import { Router } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as jwt_decode from "jwt-decode";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-askquestion',
  templateUrl: './askquestion.component.html',
  styleUrls: ['./askquestion.component.css']
})
export class AskquestionComponent implements OnInit {
	data:any;
	displayName;
	text;
	description;
	allCategories;
	selectedCatogery;
  constructor(private authService: AuthService, private router: Router, private http:HttpClient) {
   }

  ngOnInit() {
  	this.authService.verifyUser('ads').subscribe((data:any)=> {
	  		if(data.type == "lawyer") {
					this.router.navigate(['/replyquestion-lawyer']);
		  	}
		  	this.data = data
		  	this.displayName = this.data.username.split('@')[0]
		  	console.log(this.displayName)
		},
		(err) => {
			console.log("Verify erroro",err);
			this.router.navigate(['/']);
		}
	);
	this.http.get("http://localhost:8000/getCategories").toPromise().then((res:any) => {
			this.allCategories = res;
			console.log("Xczcx",this.allCategories)
		  	this.selectedCatogery = this.allCategories[0].catogery
	},
	(err:any)=> {
		console.log(err.error.Error,err);
	}
	);
  }

  updateCategory(catogery) {
  	this.selectedCatogery = catogery
  }

  askquestion() {
  	let formdata = new FormData();
	formdata.append('username', this.data.username);
	formdata.append("text", this.text);
	formdata.append("description", this.description);
	formdata.append("catogery", this.selectedCatogery);
  	console.log(formdata);

  	this.http.post("http://localhost:8000/askquestion/",formdata).toPromise().then((res:any) => {
			console.log('Response',res);
			this.text = "";
			this.description = "";
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
