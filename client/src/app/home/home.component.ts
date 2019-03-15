import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'
import { Router } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  data:any;
  topLawyers;

  images: string[] = [
  '../assets/images/img_bg_1.jpg',
  '../assets/images/img_bg_2.jpg',
  '../assets/images/img_bg_3.jpg',
  ];
  showNavigationArrows = true;
  showNavigationIndicators = true;

  constructor(private authService: AuthService, private router: Router, config: NgbCarouselConfig, private http:HttpClient) { }

  ngOnInit() {
    this.authService.verifyUser('ads').subscribe((data)=> {
      console.log("Verify success",data)
      this.data = data
      this.http.get("http://localhost:8000/topLawyers").toPromise().then((res:any) => {
        this.topLawyers = res;
        console.log(res)
      });
    },
    (err) => {
      console.log("Verify erroro",err);
      // this.router.navigate(['/'])
    }
    );
  }

  
  logout() {
    this.authService.logout();
  }

  profile() {
    if(this.data.type == 'client'){
      this.router.navigate(['/editprofile-client']);
    }
    if(this.data.type == 'lawyer'){
      this.router.navigate(['/editprofile-lawyer']);
    }
  }

  PracticeArea(name) {
    this.router.navigate(['/chooselawyer-client'], { queryParams: { "name": name } });
  }

}