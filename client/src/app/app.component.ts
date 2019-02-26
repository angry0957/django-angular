import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  url = 'http://localhost:8000/product/';

  constructor(private http: Http) {}
  
  ngOnInit() {
    $(document).ready(function() {
      $('.search-icon').click(function() {
        $('.search').slideToggle()
      })
      $('.close').click(function() {
        $('.search').slideToggle()
      })

    })
  }
  public postProducts() {

    this.http.post('http://localhost:8000/auth-jwt/',{}).toPromise().then((res:any) => {
      // console.log(res.json());
      console.log('Hello, Ssibal!!!');
      console.log(res._body);
      alert(res._body);
    });
  }

  public getProducts() {

    this.http.get(this.url).toPromise().then((res:any) => {
      // console.log(res.json());
      console.log('Hello, Ssibal!!!');
      console.log(res._body);
      alert(res._body);
    });
  }
}
