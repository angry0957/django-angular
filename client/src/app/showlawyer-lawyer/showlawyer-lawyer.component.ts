import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../services/auth.service'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as jwt_decode from "jwt-decode";

@Component({
  selector: 'app-showlawyer-lawyer',
  templateUrl: './showlawyer-lawyer.component.html',
  styleUrls: ['./showlawyer-lawyer.component.css']
})
export class ShowlawyerLawyerComponent implements OnInit {



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
		this.data = this.authService.getUserData()

			
			this.displayName = this.data.username.split('@')[0]
		
		let formdata = {
			'catogery': this.category
		}
		this.http.post("http://localhost:8000/getLawyersByCategory/",{'catogery': this.category}).toPromise().then((res:any) => {
			for (var i = 0; i < res.length; ++i) {
				let id = {
					'lawyerid': res[i].lawyerid_id
				}
				this.http.post("http://localhost:8000/getLawyerById/",{'lawyerid': res[i].lawyerid_id}).subscribe((lawyer:any) => {
					lawyer.image = "http://localhost:8000/media/" + lawyer.image
					this.lawyers.push(lawyer);
					this.allLawyers.push(lawyer);
				});
			}
		});
	}

	

	lawyerProfile(lawyer){
		// console.log(lawyer,)
		if(this.data.type == 'client'){
			this.router.navigate(["/lawyerprofile-client"], { queryParams: { "id": lawyer.id,"name":lawyer.username } })
		}
		else if (this.data.type == 'lawyer'){
			this.router.navigate(["/endorseattorney"], { queryParams: { "id": lawyer.id,"name":lawyer.username } })
		}
	}

	ratingFilter(event:any){
		this.rateFilter = event
		this.filtering()
	}

	updateRatingFilter(event:any){
		this.isApplyRatingFilter = event.target.checked 
		this.filtering()
	}

	updateCityFilter(event:any){
		this.isApplyCityFilter = event.target.checked 
		this.filtering()
	}

	cityFilter(city){
		this.cityFilterValue = city
		this.filtering()
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
