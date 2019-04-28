import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../services/auth.service'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Chooselawyer } from '../models/ChooseLawyer';
import * as jwt_decode from "jwt-decode";
@Component({
  selector: 'app-savedlawyers-client',
  templateUrl: './savedlawyers-client.component.html',
  styleUrls: ['./savedlawyers-client.component.css']
})
export class SavedlawyersClientComponent implements OnInit {
data;
lawyers;

  constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute, private http:HttpClient) {}

  ngOnInit() {
  // 	this.authService.verifyUser('ads').subscribe((data:any)=> {
		// 	this.data = data;
		// 	this.getlawyers();


		// },
		// (err) => {
		// 	console.log("Verify erroro",err);
		// 	this.router.navigate(['/']);
		// }
		// );
  }

  getlawyers(){
			
			console.log('data')
			let id = new FormData();
			id.append('username', this.data.username);

			this.http.post("http://localhost:8000/getSavedLawyers/",id).subscribe((data:any) => {
			this.lawyers = data;
			console.log(data)
			},
		(err:any) => {
			console.log(err)
		});

		}

}
