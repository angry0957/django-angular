import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../services/auth.service'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Chooselawyer } from '../models/ChooseLawyer';
import * as jwt_decode from "jwt-decode";
import {NgbTabsetConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-lawyerprofile-client',
	templateUrl: './lawyerprofile-client.component.html',
	styleUrls: ['./lawyerprofile-client.component.css'],
	 providers: [NgbTabsetConfig] // add NgbTabsetConfig to the component providers
})
export class LawyerprofileClientComponent implements OnInit {
	lawyerID;
	lawyer;

	constructor(config: NgbTabsetConfig,private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute, private http:HttpClient) {
		this.activatedRoute.queryParams.subscribe((params: Params) => {
			this.lawyerID = params.id;
		});
	}

	ngOnInit() {
		let id = new FormData();
		id.append('lawyerid', this.lawyerID);

		this.http.post("http://localhost:8000/getLawyerById/",id).subscribe((lawyer:any) => {
			lawyer.image = "http://localhost:8000/media/" + lawyer.image
			this.lawyer = lawyer;
			console.log(this.lawyer);
		});
	}

	review() {
		console.log("Buhaha")
		this.router.navigate(["/ratelawyer"], { queryParams: { "id": this.lawyerID } })
	}

}
