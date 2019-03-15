import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Chooselawyer } from '../models/ChooseLawyer';

@Component({
  selector: 'app-chooselawyer-client',
  templateUrl: './chooselawyer-client.component.html',
  styleUrls: ['./chooselawyer-client.component.css']
})
export class ChooselawyerClientComponent implements OnInit {
	
	category;
	lawyers : Array<any> = [];

  constructor(private activatedRoute: ActivatedRoute, private http:HttpClient) {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.category = params.name;
    });
  }

  ngOnInit() {

    
  	let formdata = new FormData();
	formdata.append('catogery', this.category);
  	this.http.post("http://localhost:8000/getLawyersByCategory/",formdata).toPromise().then((res:any) => {
	  	for (var i = 0; i < res.length; ++i) {
		  	let id = new FormData();
			id.append('lawyerid', res[i].lawyerid_id);
		  	this.http.post("http://localhost:8000/getLawyerById/",id).subscribe((lawyer:any) => {
		        lawyer.image = "http://localhost:8000/media/" + lawyer.image
            this.lawyers.push(lawyer);
            console.log(lawyer);
			});
	  	}
      });
  }
}
