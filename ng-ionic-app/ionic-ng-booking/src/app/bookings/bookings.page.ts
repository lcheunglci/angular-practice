import { Component, OnDestroy, OnInit } from '@angular/core';
import { BookingService } from './booking.service';
import { Booking } from './booking.model';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[] = [];
  private bookingSub: Subscription = new Subscription();

  constructor(private bookingService: BookingService) {}
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

  onCancelBooking(offerId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    // cancel booking with offerId
    this.bookingService.cancelBooking(offerId);
  }
}
