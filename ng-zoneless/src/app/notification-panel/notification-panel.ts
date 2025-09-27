import { ChangeDetectionStrategy, Component, DoCheck, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';
import { NotificationItemComponent } from '../notification-item/notification-item';
import { Notification, NotificationService } from './notifications';

@Component({
    selector: 'app-notification-panel',
    templateUrl: './notification-panel.html',
    imports: [
        NotificationItemComponent, 
        // AsyncPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationPanelComponent implements DoCheck {
    // --------------------------------------------- Before
    // protected notifications$ = new BehaviorSubject<Notification[]>([
    //     { id: crypto.randomUUID(), message: 'Welcome!', read: false },
    //     { id: crypto.randomUUID(), message: 'Angular is awesome!', read: false }
    // ]);
    
    // protected notifications = this.notifications$.value;

    // --------------------------------------------- Signals
    protected notifications = signal<Notification[]>([
        { id: crypto.randomUUID(), message: 'Welcome!', read: false },
        { id: crypto.randomUUID(), message: 'Angular is awesome!', read: false }
    ]);

    // --------------------------------------------- Signal From Observable
    // private incoming = toSignal(this.notificationService.notifications, { initialValue: null });
    // protected notifications = linkedSignal({
    //     source: this.incoming,
    //     computation: (incoming: Notification | null, previous?: { source: Notification | null; value: Notification[]; }) => {
    //         if (!previous) { 
    //             return [
    //                 { id: crypto.randomUUID(), message: 'Welcome!', read: false },
    //                 { id: crypto.randomUUID(), message: 'Angular is awesome!', read: false }
    //             ];
    //         }
    //         return incoming ? [...previous.value, incoming] : previous.value;
    //     }
    // });

    // --------------------------------------------- Manual Change Detection
    // private cdRef = inject(ChangeDetectorRef);

    private notificationService = inject(NotificationService);

    constructor() {
        this.notificationService.notifications
            .pipe(takeUntilDestroyed())
            .subscribe(notification => {
                // --------------------------------------------- Before
                // this.notifications = [...this.notifications, notification];
                
                // --------------------------------------------- Async Pipe
                // this.notifications$.next(this.notifications);
                
                // --------------------------------------------- Manual Change Detection
                // this.cdRef.markForCheck();
                // this.cdRef.detectChanges();

                // --------------------------------------------- Signals
                this.notifications.update(v => [...v, notification]);
            });
    }

    ngDoCheck() {
        console.log('NotificationPanel checked');
    }
    
    markAllRead() {
        // --------------------------------------------- Before
        // this.notifications = this.notifications.map(n => ({ ...n, read: true }));
        // this.notifications$.next(this.notifications);

        // --------------------------------------------- Signals
        this.notifications.update(v => v.map(n => ({ ...n, read: true })));
    }
}