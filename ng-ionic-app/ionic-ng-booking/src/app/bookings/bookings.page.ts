import { Component, OnDestroy, OnInit } from '@angular/core';
import { BookingService } from './booking.service';
import { Booking } from './booking.model';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[] = [];
  private bookingSub: Subscription = new Subscription();
  isLoading = false;

  constructor(
    private bookingService: BookingService,
    private loadingCtrl: LoadingController
  ) {}
  ngOnDestroy(): void {
    this.bookingSub.unsubscribe();
  }

  ngOnInit() {
    this.bookingSub.add(
      this.bookingService.bookings.subscribe((bookings) => {
        this.loadedBookings = bookings;
      })
    );
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.bookingService.fetchBookings().subscribe(() => {
      this.isLoading = false;
    });
  }

  onCancelBooking(bookingId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    // cancel booking with offerId
    this.loadingCtrl
      .create({
        message: 'Cancelling...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.bookingService.cancelBooking(bookingId).subscribe(() => {
          loadingEl.dismiss();
        });
      });
  }
}
