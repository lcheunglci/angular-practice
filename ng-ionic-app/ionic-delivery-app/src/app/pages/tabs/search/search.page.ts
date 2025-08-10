import { Restaurant } from './../../../models/home.model';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  @ViewChild('searchInput') searchInput: any;
  model: any = {
    icon: 'search-outline',
    title: 'No Restaurant records found',
  };

  isLoading: boolean = false;
  query: string = '';

  allRestaurants = [
    {
      uid: '1001',
      cover: 'assets/imgs/1.jpg',
      name: 'Stayfit',
      short_name: 'stayfit',
      cuisines: ['Italian', 'Mexican'],
      rating: 5,
      delivery_time: 25,
      price: 100,
    },
    {
      uid: '1002',
      cover: 'assets/imgs/2.jpg',
      name: 'Stayfit1',
      short_name: 'stayfit1',
      cuisines: ['Italian', 'Mexican'],
      rating: 5,
      delivery_time: 25,
      price: 100,
    },
    {
      uid: '1003',
      cover: 'assets/imgs/3.jpg',
      name: 'Stayfit2',
      short_name: 'stayfit2',
      cuisines: ['Italian', 'Mexican'],
      rating: 5,
      delivery_time: 25,
      price: 100,
    },
  ];
  restaurants: any[] = [];

  constructor() {}

  ngOnInit() {
    setTimeout(() => {
      this.searchInput.setFocus();
    }, 500);
  }

  async onSearchChange(event: any) {
    console.log(event.detail.value);
    this.query = <string>event.detail.value.toLowerCase();
    this.restaurants = [];
    if (this.query.length > 0) {
      this.isLoading = true;
      setTimeout(async () => {
        this.restaurants = await this.allRestaurants.filter((element: any) =>
          element.short_name.includes(this.query)
        );
      }, 3000);
      console.log(this.restaurants);
      this.isLoading = false;
    }
  }
}
