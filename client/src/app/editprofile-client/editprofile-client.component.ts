import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'
import { Router } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as jwt_decode from "jwt-decode";

@Component({
  selector: 'app-editprofile-client',
  templateUrl: './editprofile-client.component.html',
  styleUrls: ['./editprofile-client.component.css']
})
export class EditprofileClientComponent implements OnInit {
   data;
   displayName;

	constructor(private authService: AuthService, private router: Router, private http:HttpClient) {
   }
  ngOnInit() {
  	this.authService.verifyUser('ads').subscribe((data:any)=> {
	  		if(data.type == "lawyer") {
					this.router.navigate(['/replyquestion-lawyer']);
		  	}
		  	this.data = jwt_decode(data.token);
		  	this.displayName = this.data.username.split('@')[0]
		  	console.log(this.displayName)
		},
		(err) => {
			console.log("Verify erroro",err);
			this.router.navigate(['/']);
		}
	);
  }
  logout() {
    this.authService.logout();
  }
}
