import { Injectable } from '@angular/core';
import { interval, map, Observable } from 'rxjs';

export interface Notification {
    id: string;
    message: string;
    read: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
    // Emits a "notification" every 2 seconds
    notifications: Observable<Notification> = interval(2000).pipe(
        map(i => ({
            id: crypto.randomUUID(),
            message: `Notification ${i + 1} at ${new Date().toLocaleTimeString()}`,
            read: false,
        }))
    );
}