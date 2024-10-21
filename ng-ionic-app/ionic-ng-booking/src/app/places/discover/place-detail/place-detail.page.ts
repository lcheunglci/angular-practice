import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, switchMap, take } from 'rxjs';
import { BookingService } from 'src/app/bookings/booking.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MapModalComponent } from 'src/app/shared/map-modal/map-modal.component';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place!: Place;
  isBookable = false;
  placeSub: Subscription = new Subscription();
  isLoading = false;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private bookingService: BookingService,
    private loadingCtrl: LoadingController,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.isLoading = true;
      const placeId = paramMap.get('placeId') ?? '';
      let fetchedUserId: string;
      this.placeSub.add(
        this.auth.userId
          .pipe(
            take(1),
            switchMap((userId) => {
              if (!userId) {
                throw Error('No user id found.');
              }
              fetchedUserId = userId;
              return this.placesService.getPlace(placeId);
            })
          )
          .subscribe({
            next: (place) => {
              this.place = place as Place;
              this.isBookable = place.userId !== fetchedUserId;
              this.isLoading = false;
            },
            error: (error) => {
              this.alertCtrl
                .create({
                  header: 'An error occurred!',
                  message: 'Could not load place.',
                  buttons: [
                    {
                      text: 'Okay',
                      handler: () => {
                        this.router.navigate(['/places/tabs/discover']);
                      },
                    },
                  ],
                })
                .then((alertEl) => {
                  alertEl.present();
                });
            },
          })
      );
    });
  }

  onBookPlace() {
    // note the navigation with default router would show the wrong transition animation
    // this.router.navigateByUrl('places/tabs/discover');
    // this.navCtrl.pop(); // only if there's previous page
    // this.navCtrl.navigateBack('/places/tabs/discover');

    this.actionSheetCtrl
      .create({
        header: 'Choose an Action',
        buttons: [
          {
            text: 'Select Date',
            handler: () => {
              this.openBookingModal('select');
            },
          },
          {
            text: 'Random Date',
            handler: () => {
              this.openBookingModal('random');
            },
          },
          { text: 'Cancel', role: 'cancel' },
        ],
      })
      .then((actionSheetEl) => {
        actionSheetEl.present();
      });
  }

  openBookingModal(mode: 'select' | 'random') {
    console.log(mode);
    this.modalCtrl
      .create({
        component: CreateBookingComponent,
        componentProps: {
          selectedPlace: this.place,
          selectedMode: mode,
        },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((resultData) => {
        if (resultData.role === 'confirm') {
          this.loadingCtrl
            .create({
              message: 'Booking place...',
            })
            .then((loadingEl) => {
              loadingEl.present();
              const data = resultData.data;
              this.bookingService
                .addBooking(
                  this.place.id,
                  this.place.title,
                  this.place.imageUrl,
                  data.firstName,
                  data.lastName,
                  data.guestNumber,
                  data.startDate,
                  data.endDate
                )
                .subscribe(() => {
                  loadingEl.dismiss();
                });
            });
        }
      });
  }

  onShowFullMap() {
    this.modalCtrl
      .create({
        component: MapModalComponent,
        componentProps: {
          center: {
            lat: this.place.location.lat,
            lng: this.place.location.lng,
          },
          selectable: false,
          closeButtonText: 'Close',
          title: this.place.location.address,
        },
      })
      .then((modalEl) => {
        modalEl.present();
      });
  }
}
