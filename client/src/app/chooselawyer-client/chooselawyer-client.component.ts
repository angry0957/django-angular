import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../services/auth.service'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Chooselawyer } from '../models/ChooseLawyer';
import * as jwt_decode from "jwt-decode";

@Component({
	selector: 'app-chooselawyer-client',
	templateUrl: './chooselawyer-client.component.html',
	styleUrls: ['./chooselawyer-client.component.css']
})
export class ChooselawyerClientComponent implements OnInit {
	
	category;
	allCities = ['Lahore','Karachi','islamabad','peshawar','queta','murree','others']
	lawyers : Array<any> = [];
	allLawyers: Array<any> = []
	data:any;
	displayName;
	text;
	description;
	rate = 4;
	rateFilter = 5;
	cityFilterValue = 'Lahore'
	isApplyRatingFilter = false;
	isApplyCityFilter = false;

	constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute, private http:HttpClient) {
		this.activatedRoute.queryParams.subscribe((params: Params) => {
			this.category = params.name;
		});
	}

	ngOnInit() {

		this.authService.verifyUser('ads').subscribe((data:any)=> {
			if(data.type == "lawyer") {
				this.router.navigate(['/replyquestion-lawyer']);
			}
			this.data = jwt_decode(data.token);
			this.displayName = this.data.username.split('@')[0]
		},
		(err) => {
			console.log("Verify erroro",err);
			this.router.navigate(['/']);
		}
		);
		
		let formdata = new FormData();
		formdata.append('catogery', this.category);
		this.http.post("http://localhost:8000/getLawyersByCategory/",formdata).toPromise().then((res:any) => {
			for (var i = 0; i < res.length; ++i) {
				let id = new FormData();
				id.append('lawyerid', res[i].lawyerid_id);
				this.http.post("http://localhost:8000/getLawyerById/",id).subscribe((lawyer:any) => {
					lawyer.image = "http://localhost:8000/media/" + lawyer.image
					this.lawyers.push(lawyer);
					this.allLawyers.push(lawyer);
				});
			}
		});
	}

	

	lawyerProfile(lawyer){
		this.router.navigate(["/lawyerprofile-client"], { queryParams: { "id": lawyer.id,"name":lawyer.username } })
	}

	ratingFilter(event:any){
		this.rateFilter = event
		this.filtering()
		// console.log(event)
		// if(this.isApplyRatingFilter == true){
		// 	this.lawyers = [];
		// 	for(let i = 0;i<this.allLawyers.length;i++){
		// 		if(this.allLawyers[i].rate == this.rateFilter){
		// 			this.lawyers.push(this.allLawyers[i])
		// 		}
		// 	}
		// }
		// else {
		// 	this.lawyers = this.allLawyers;
		// }
	}

	updateRatingFilter(event:any){
		this.isApplyRatingFilter = event.target.checked 
		this.filtering()
		
		// console.log(event.target.checked)
		// this.ratingFilter(this.rateFilter)
	}

	updateCityFilter(event:any){
		this.isApplyCityFilter = event.target.checked 
		this.filtering()
		// console.log(event.target.checked)
		// this.cityFilter(this.cityFilterValue)
	}

	cityFilter(city){
		this.cityFilterValue = city
		this.filtering()
		// console.log(city)
		
	}

	filtering(){
		if(this.isApplyCityFilter == true && this.isApplyRatingFilter == false){
			this.lawyers = [];
			for(let i = 0;i<this.allLawyers.length;i++){
				if(this.allLawyers[i].city.toLowerCase() == this.cityFilterValue.toLowerCase()){
					this.lawyers.push(this.allLawyers[i])
				}
			}
		}
		else if(this.isApplyCityFilter == true && this.isApplyRatingFilter == true){
			let temp = [];
			for(let i = 0;i<this.allLawyers.length;i++){
				if(this.allLawyers[i].rate == this.rateFilter && this.allLawyers[i].city.toLowerCase() == this.cityFilterValue.toLowerCase()){
					temp.push(this.allLawyers[i])
				}
			}
			this.lawyers = temp;
		}
		else if(this.isApplyCityFilter == false && this.isApplyRatingFilter == true){
			this.lawyers = [];
			for(let i = 0;i<this.allLawyers.length;i++){
				if(this.allLawyers[i].rate == this.rateFilter){
					this.lawyers.push(this.allLawyers[i])
				}
			}
		}
		else{
			this.lawyers = this.allLawyers;
		}
	}

}
