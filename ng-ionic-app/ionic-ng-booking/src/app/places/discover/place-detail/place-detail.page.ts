import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  constructor(private navCtrl: NavController) {}

  ngOnInit() {}

  onBookPlace() {
    // note the navigation with default router would show the wrong transition animation
    // this.router.navigateByUrl('places/tabs/discover');
    // this.navCtrl.pop(); // only if there's previous page
    this.navCtrl.navigateBack('/places/tabs/discover');
  }
}
