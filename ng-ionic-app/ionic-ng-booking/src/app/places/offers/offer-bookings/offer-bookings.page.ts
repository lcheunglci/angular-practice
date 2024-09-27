import { Component, OnDestroy, OnInit } from '@angular/core';
import { Place } from '../../place.model';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './offer-bookings.page.html',
  selector: 'app-offer-bookings',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit, OnDestroy {
  place?: Place;
  placeSub: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private placesService: PlacesService
  ) {}
  ngOnDestroy(): void {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

  ngOnInit() {
    // note: it'll be cached so only called once
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }

      const placeId = paramMap.get('placeId') ?? '';
      this.placeSub.add(
        this.placesService.getPlace(placeId).subscribe((place) => {
          this.place = place as Place;
        })
      );
      //this.place = this.placesService.getPlace(placeId) as Place;
    });
  }
}
