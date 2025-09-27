import { ChangeDetectionStrategy, Component, DoCheck, input } from '@angular/core';
import { Notification } from '../notification-panel/notifications';

@Component({
    selector: 'app-notification-item',
    templateUrl: './notification-item.html',
    styleUrls: ['./notification-item.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationItemComponent implements DoCheck {
    readonly notification = input.required<Notification>();

    ngDoCheck() {
        console.log('NotificationItem checked');
    }
}
