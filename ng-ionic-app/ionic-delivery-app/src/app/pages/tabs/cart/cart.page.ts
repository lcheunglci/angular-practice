import { Restaurant } from 'src/app/models/home.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { IonContent } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  urlCheck: any;
  url: any;
  model: any;
  deliveryCharge = 20;
  instruction: string = '';
  location: any = {};

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkUrl();
    this.getModel();
  }

  getCart() {
    return Preferences.get({ key: 'cart' });
  }

  async getModel() {
    let data: any = await this.getCart();
    this.location = {
      lat: 47.60573476038986,
      lng: -122.33775157730875,
      address: 'Seattle, Washington',
    };
    if (data?.value) {
      this.model = await JSON.parse(data.value);
      console.log(this.model);
      this.calculate();
    }
  }

  async calculate() {
    let item = this.model.items.filter((x: any) => x.quantity > 0);
    this.model.items = item;
    this.model.total = 0;
    this.model.totalItem = 0;
    this.model.deliveryCharge = 0;
    this.model.grandTotal = 0;

    item.forEach((element: any) => {
      this.model.totalItem += element.quantity;
      this.model.totalPrice += parseFloat(element.price) * element.quantity;
    });
    this.model.deliveryCharge = this.deliveryCharge;
    this.model.totalPrice = parseFloat(this.model.totalPrice).toFixed(2);
    this.model.grandTotal = (
      parseFloat(this.model.totalPrice) + parseFloat(this.model.deliveryCharge)
    ).toFixed(2);
    if (this.model.total === 0) {
      this.model.totalItem = 0;
      this.model.totalPrice = 0;
      this.model.grandTotal = 0;
      await this.clearCart();
      this.model = null;
    }
    console.log('cart: ', this.model);
  }

  clearCart() {
    return Preferences.remove({ key: 'cart' });
  }

  checkUrl() {
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

  quantityPlus(index: number) {
    try {
      console.log(this.model.items[index]);
      if (
        !this.model.items[index].quantity ||
        this.model.items[index].quantity === 0
      ) {
        this.model.items[index].quantity = 1;
        this.calculate();
      } else {
        this.model.items[index].quantity += 1;
      }
    } catch (error) {
      console.log(error);
    }
  }
  quantityMinus(index: number) {
    try {
      console.log(this.model.items[index]);
      if (this.model.items[index].quantity !== 0) {
        this.model.items[index].quantity -= 1;
        this.calculate();
      } else {
        this.model.items[index].quantity = 0;
      }
    } catch (error) {
      console.log(error);
    }
  }

  addAddress() {}
  changeAddress() {}
  makePayment() {
    try {
      const data = {
        restaurant_id: this.model.restaurant.uid,
        res: this.model.restaurant,
        order: JSON.stringify(this.model.items),
        time: moment().format('lll'),
        address: this.location,
        total: this.model.totalPrice,
        grandTotal: this.model.grandTotal,
        deliveryCharge: this.deliveryCharge,
        status: 'Created',
        paid: 'COD',
      };
      console.log('order:', data);
    } catch (e) {
      console.log(e);
    }
  }

  scrollToBottom() {
    this.content.scrollToBottom(500);
  }
}
