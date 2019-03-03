import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'
import { Router } from '@angular/router'
import * as jwt_decode from "jwt-decode";

@Component({
  selector: 'app-askquestion',
  templateUrl: './askquestion.component.html',
  styleUrls: ['./askquestion.component.css']
})
export class AskquestionComponent implements OnInit {
	data:any;
	displayName;
  constructor(private authService: AuthService, private router: Router) {
   }

  ngOnInit() {
  	this.authService.verifyUser('ads').subscribe((data:any)=> {
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

}
