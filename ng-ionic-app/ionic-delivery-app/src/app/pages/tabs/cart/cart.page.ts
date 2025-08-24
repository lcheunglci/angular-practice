import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  urlCheck: any;
  url: any;

  constructor(private router: Router) {}

  ngOnInit() {
    let url: any = this.router.url.split('/');
    console.log(url);

    const spliced = url.splice(url.length - 2, 2); // /tabs/cart url.length - 1 -1
    this.urlCheck = spliced[0];
    console.log('urlcheck', this.urlCheck);
    url.push(this.urlCheck);
    this.url = url;
    console.log(this.url);
  }

  getPreviousUrl() {
    return this.url.join('/');
  }
}
