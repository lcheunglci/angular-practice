import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { NavController } from '@ionic/angular';
import { Restaurant } from 'src/app/models/home.model';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit {
  id: any;
  data: any = {};
  items: any[] = [];
  cartData: any = {};
  veg: boolean = false;
  storeData: any = {};
  isLoading: boolean = false;

  restaurants: any[] = [
    {
      uid: '1001',
      cover: 'assets/imgs/1.jpg',
      name: 'Stayfit',
      short_name: 'stayfit',
      address: '1234 Test, CA',
      cuisines: ['Italian', 'Mexican'],
      rating: 5,
      delivery_time: 25,
      distance: 2.5,
      price: 100,
    },
    {
      uid: '1002',
      cover: 'assets/imgs/2.jpg',
      name: 'Stayfit1',
      short_name: 'stayfit1',
      address: '2345 Test, CA',
      cuisines: ['Italian', 'Mexican'],
      rating: 5,
      delivery_time: 25,
      distance: 2.5,
      price: 100,
    },
    {
      uid: '1003',
      cover: 'assets/imgs/3.jpg',
      name: 'Stayfit2',
      short_name: 'stayfit2',
      address: '4321 Test, CA',
      cuisines: ['Italian', 'Mexican'],
      rating: 5,
      delivery_time: 25,
      distance: 2.5,
      price: 100,
    },
  ];

  categories: any[] = [
    {
      id: 'e00',
      name: 'Italian',
      uid: '12wefdss',
    },
    {
      id: 'e0',
      name: 'Mexican',
      uid: '12wefdss',
    },
  ];

  allItems = [
    {
      category_id: 'e00',
      cover: 'assets/imgs/pizza.jpg',
      desc: 'Great in taste',
      id: 'i1',
      name: 'Pizza',
      rating: 0,
      status: true,
      uid: '12wefdss',
      variation: false,
      veg: false,
    },
    {
      category_id: 'e01',
      cover: 'assets/imgs/salad.jpg',
      desc: 'Great in taste',
      id: 'i2',
      name: 'Caprese Salad',
      rating: 0,
      status: true,
      uid: '12wefdss',
      variation: false,
      veg: true,
    },
    {
      category_id: 'e02',
      cover: 'assets/imgs/soup.jpg',
      desc: 'Great in taste',
      id: 'i1',
      name: 'Soup',
      rating: 0,
      status: true,
      uid: '12wefdss',
      variation: false,
      veg: false,
    },
    {
      category_id: 'e03',
      cover: 'assets/imgs/pasta.jpg',
      desc: 'Great in taste',
      id: 'i1',
      name: 'Pasta',
      rating: 0,
      status: true,
      uid: '12wefdss',
      variation: false,
      veg: false,
    },
  ];

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      console.log('data: ', paramMap);
      if (!paramMap.has('restaurantId')) {
        this.navCtrl.back();
        return;
      }

      this.id = paramMap.get('restaurantId');
      console.log('id: ', this.id);
      this.getItems();
    });
  }

  getCart() {
    return Preferences.get({ key: 'cart' });
  }

  async getItems() {
    this.isLoading = true;
    this.data = {};
    this.cartData = {};
    this.storeData = {};
    setTimeout(async () => {
      let data: any = this.restaurants.filter((x) => x.uid === this.id);
      this.data = data[0];
      this.categories = this.categories.filter((x) => x.uid === this.id);
      this.items = this.allItems.filter((x) => x.uid === this.id);
      console.log('restaurant: ', this.data);
      let cart: any = await this.getCart();
      console.log('cart:', cart);
      if (cart?.value) {
        this.storeData = JSON.parse(cart.value);
        console.log('storeData', this.storeData);
        if (
          this.id === this.storeData.restaurant.uid &&
          this.allItems.length > 0
        ) {
          this.allItems.forEach((element: any) => {
            this.storeData.items.forEach((ele: any) => {
              if (element.id !== ele.id) {
                return;
              }
              element.quantity = ele.quantity;
            });
          });
        }
        this.cartData.totalItem = this.storeData.totalItem;
        this.cartData.totalPrice = this.storeData.totalPrice;
      }
      this.isLoading = false;
    }, 300);
  }

  vegOnly(event: any) {
    console.log(event.detail.checked);
    this.items = [];
    if (event.detail.checked) {
      this.items = this.allItems.filter((x) => x.veg);
    } else {
      this.items = this.allItems;
    }
    console.log('items', this.items);
  }

  quantityPlus(index: number) {
    try {
      console.log(this.items[index]);
      if (!this.items[index].quantity || this.items[index].quantity === 0) {
        this.items[index].quantity = 1;
        this.calculate();
      } else {
        this.items[index].quantity += 1;
      }
    } catch (error) {
      console.log(error);
    }
  }

  quantityMinus(index: number) {
    try {
      console.log(this.items[index]);
      if (this.items[index].quantity !== 0) {
        this.items[index].quantity -= 1;
        this.calculate();
      } else {
        this.items[index].quantity = 0;
      }
    } catch (error) {
      console.log(error);
    }
  }

  calculate() {
    console.log(this.items);
    this.cartData.item = [];
    let item = this.items.filter((x) => x.quantity > 0);
    console.log('added item', item);
    this.cartData.items = item;
    this.cartData.totalPrice = 0;
    this.cartData.totalItem = 0;
    item.forEach((element) => {
      this.cartData.totalItem += element.quantity;
      this.cartData.totalPrice += parseFloat(element.price) * element.quantity;
    });
    this.cartData.totalPrice = parseFloat(this.cartData.totalPrice).toFixed(2);
    if (this.cartData.total === 0) {
      this.cartData.totalItem = 0;
      this.cartData.totalPrice = 0;
    }
    console.log('cart: ', this.cartData);
  }

  async viewCart() {
    if (this.cartData.items && this.cartData.items.length > 0) {
      await this.saveToCart();
      // this.router.navigate([this.router.url + '/cart']);
    }
  }

  async saveToCart() {
    try {
      this.cartData.restaurant = {};
      this.cartData.restaurant = this.data;
      console.log('cartData', this.cartData);
      await Preferences.set({
        key: 'cart',
        value: JSON.stringify(this.cartData),
      });
    } catch (error) {
      console.log(error);
    }
  }
}
