import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  loadedPlaces: Place[] = [];
  constructor(private placesService: PlacesService) { }

  ngOnInit() {
    // note: only fetch once due to caching
    this.loadedPlaces = this.placesService.places;
  }

}
