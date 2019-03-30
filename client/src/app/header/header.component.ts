import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'
import { Router } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  data:any;
  topLawyers;
  displayName;

  constructor(private authService: AuthService, private router: Router, private http:HttpClient) { }

  ngOnInit() {
    this.authService.verifyUser('ads').subscribe((data)=> {
      this.data = data
    },
    (err) => {
      this.router.navigate(['/'])
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

  scroll(el) {
  	// console.log(el)
  	console.log(document.getElementById(el))
    document.getElementById(el).scrollIntoView({behavior:"smooth"});
  }

}
