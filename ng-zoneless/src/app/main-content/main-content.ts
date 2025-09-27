import { ChangeDetectionStrategy, Component, DoCheck } from '@angular/core';
import { NotificationPanelComponent } from '../notification-panel/notification-panel';
import { WelcomeComponent } from '../welcome/welcome';

@Component({
    selector: 'app-main-content',
    templateUrl: './main-content.html',
    imports: [
        NotificationPanelComponent,
        WelcomeComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainContentComponent implements DoCheck {
    ngDoCheck() {
        console.log('MainContent checked');
    }
}