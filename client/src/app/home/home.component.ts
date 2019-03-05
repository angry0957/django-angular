import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'
import { Router } from '@angular/router'
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  data:any;

  images: string[] = [
  '../assets/images/img_bg_1.jpg',
  '../assets/images/img_bg_2.jpg',
  '../assets/images/img_bg_3.jpg',
  ];
  showNavigationArrows = true;
  showNavigationIndicators = true;

  constructor(private authService: AuthService, private router: Router, config: NgbCarouselConfig) { }

  ngOnInit() {
    this.authService.verifyUser('ads').subscribe((data)=> {
      console.log("Verify success",data)
      this.data = data
    },
    (err) => {
      console.log("Verify erroro",err);
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

}