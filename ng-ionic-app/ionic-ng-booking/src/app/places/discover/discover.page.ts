import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { SegmentChangeEventDetail } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[] = [];
  listedLoadedPlaces: Place[] = [];
  private placesSub: Subscription = new Subscription();

  constructor(private placesService: PlacesService) {}

  ngOnInit() {
    this.placesSub.add(
      this.placesService.places.subscribe((places) => {
        this.loadedPlaces = places;
        this.listedLoadedPlaces = this.loadedPlaces.slice(1);
      })
    );
  }

  ngOnDestroy(): void {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  onFilterUpdate(event: Event) {
    console.log(event);
    //
  }
}
