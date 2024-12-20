import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  ModalController,
} from '@ionic/angular';
import { MapModalComponent } from '../../map-modal/map-modal.component';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, of, switchMap } from 'rxjs';
import { Coordinates, PlaceLocation } from 'src/app/places/location.model';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  @Output() locationPick: EventEmitter<PlaceLocation> =
    new EventEmitter<PlaceLocation>();
  @Input() showPreview = false;

  selectedLocationImage: string = '';
  isLoading = false;

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  onPickLocation() {
    this.actionSheetCtrl
      .create({
        header: 'Please chose',
        buttons: [
          {
            text: 'Auto-Locate',
            handler: () => {
              this.locateUser();
            },
          },
          {
            text: 'Pick on Map',
            handler: () => {
              this.openMap();
            },
          },
          { text: 'Cancel', role: 'cancel' },
        ],
      })
      .then((actionSheetEl) => {
        actionSheetEl.present();
      });
  }

  private locateUser() {
    if (Capacitor.isPluginAvailable('Geolocation')) {
      this.alertCtrl.create({
        header: 'Could not fetch location',
        message: 'Please use the map to pick a location!',
      });
      return;
    }

    this.isLoading = true;
    Geolocation.getCurrentPosition()
      .then((geoPosition) => {
        const coordinates: Coordinates = {
          lat: geoPosition.coords.latitude,
          lng: geoPosition.coords.longitude,
        };
        this.createPlace(coordinates.lat, coordinates.lng);
        this.isLoading = false;
      })
      .catch((err) => {
        this.isLoading = false;
        this.showErrorAlert();
      });
  }


  private createPlace(lat: number, lng: number) {
    const pickedLocation: PlaceLocation = {
      lat: lat,
      lng: lng,
      address: '',
      staticMapImageUrl: ''
    };
    this.isLoading = true;
    this.getAddress(lat, lng)
      .pipe(
        switchMap(address => {
          pickedLocation.address = address;
          return of(
            this.getMapImage(pickedLocation.lat, pickedLocation.lng, 14)
          );
        })
      )
      .subscribe(staticMapImageUrl => {
        pickedLocation.staticMapImageUrl = staticMapImageUrl;
        this.selectedLocationImage = staticMapImageUrl;
        this.isLoading = false;
        this.locationPick.emit(pickedLocation);
      });
  }

  showErrorAlert() {
    this.alertCtrl
      .create({
        header: 'Could not fetch location',
        message: 'Please use the map to pick a location!',
        buttons: ['Okay']
      })
      .then((alertEl) => alertEl.present());
  }

  openMap() {
    this.modalCtrl.create({ component: MapModalComponent }).then((modalEl) => {
      modalEl.onDidDismiss().then((modalData) => {
        if (!modalData.data) {
          return;
        }

        const pickedLocation: PlaceLocation = {
          lat: modalData.data.lat,
          lng: modalData.data.lng,
          address: '',
          staticMapImageUrl: '',
        };

        this.isLoading = true;
        this.getAddress(modalData.data.lat, modalData.data.lng)
          .pipe(
            switchMap((address) => {
              pickedLocation.address = address;

              return of(
                this.getMapImage(pickedLocation.lat, pickedLocation.lng, 14)
              );
            })
          )
          .subscribe((staticMapImageUrl) => {
            pickedLocation.staticMapImageUrl = staticMapImageUrl;
            this.selectedLocationImage = staticMapImageUrl;
            this.isLoading = false;
            this.locationPick.emit(pickedLocation);
          });
      });
      modalEl.present();
    });
  }

  private getAddress(lat: number, lng: number) {
    return this.http
      .get<any>(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.GOOGLE_MAP_API_KEY}`
      )
      .pipe(
        map((geoData) => {
          if (!geoData || !geoData.results || geoData.results.length === 0) {
            return null;
          }

          return geoData.results[0].formatted_address;
        })
      );
  }

  private getMapImage(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}
      &size=500x300&maptype=roadmap&markers=color:red%7Clabel:Place%7C${lat},${lng}
      &key=${environment.GOOGLE_MAP_API_KEY}`;
  }
}
