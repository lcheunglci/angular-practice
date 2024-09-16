import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  offers: {id: string, imageUrl: string, title: string}[] = [];

  constructor() { }

  ngOnInit() {
  }

}
