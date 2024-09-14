import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {}

  onBookPlace() {
    // note the navigation with default router would show the wrong transition animation
    // this.router.navigateByUrl('places/tabs/discover');
    // this.navCtrl.pop(); // only if there's previous page
    // this.navCtrl.navigateBack('/places/tabs/discover');
    this.modalCtrl
      .create({ component: CreateBookingComponent })
      .then((modalEl) => {
        modalEl.present();
      });
  }
}
