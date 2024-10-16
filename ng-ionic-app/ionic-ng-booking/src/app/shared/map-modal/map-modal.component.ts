import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit {
  constructor(private modalCtrl: ModalController) {}

  ngAfterViewInit(): void {
    this.getGoogleMaps().then(
      googleMaps => {
        
      }
    ).catch(err => {
      console.log(err);
    })
  }

  ngOnInit() {}

  onCancel() {
    this.modalCtrl.dismiss();
  }

  private getGoogleMaps() {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'http://maps.googleapis.com/maps/api/js?key=' + environment.GOOGLE_MAP_API_KEY;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () =>  {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google maps SDK not available');
        }
      }
    })
  }
}
