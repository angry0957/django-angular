import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-findlawyer-client',
  templateUrl: './findlawyer-client.component.html',
  styleUrls: ['./findlawyer-client.component.css']
})
export class FindlawyerClientComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      console.log(params.name);
    });
  }

  ngOnInit() {
  }

}
