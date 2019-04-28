import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service'
import { Router } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {

  data:any;
  notify_number = 0;
  topLawyers;
  displayName;
  showNotification = false;
  private notifierService: Subscription;

  constructor(private authService: AuthService, private router: Router, private http:HttpClient) { }

  ngOnInit() {
    this.notify();
    this.data =this.authService.getUserData()
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
    document.getElementById(el).scrollIntoView({behavior:"smooth"});
  }

  notify(){
    this.notifierService = this.authService.currentMessage.subscribe(data=>{
      this.notify_number = data;
    })
  }

  ngOnDestroy() {
    this.notifierService.unsubscribe();
  }

}
