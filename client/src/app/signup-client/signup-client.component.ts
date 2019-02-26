import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup-client',
  templateUrl: './signup-client.component.html',
  styleUrls: ['./signup-client.component.css']
})
export class SignupClientComponent implements OnInit {
	isLoading = true;
  constructor() { }

  ngOnInit() {
  	this.isLoading = false;
  }

}
