import { ChangeDetectionStrategy, Component, DoCheck } from '@angular/core';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileComponent implements DoCheck {
    ngDoCheck() {
        console.log('UserProfile checked');
    }
}
