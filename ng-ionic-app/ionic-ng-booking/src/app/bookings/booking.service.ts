import { Injectable } from '@angular/core';
import { Booking } from './booking.model';
import { BehaviorSubject, delay, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private _bookings = new BehaviorSubject<Booking[]>([]);

  constructor(private auth: AuthService) {}

  get bookings() {
    return this._bookings.asObservable();
  }

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const newBooking = new Booking(
      Math.random().toString(),
      placeId,
      this.auth.userId,
      placeTitle,
      placeImage,
      firstName,
      lastName,
      guestNumber,
      dateFrom,
      dateTo
    );

    return this.bookings.pipe(
      take(1),
      delay(1000),
      tap((bookings) => {
        this._bookings.next(bookings.concat(newBooking));
      })
    );
  }

  cancelBooking(bookingId: string) {}
}
