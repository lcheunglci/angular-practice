import { ChangeDetectionStrategy, Component, DoCheck, OnDestroy, OnInit } from '@angular/core';

@Component({
    selector: 'app-activity-feed',
    templateUrl: './activity-feed.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityFeedComponent implements OnInit, OnDestroy, DoCheck {
    protected lastActivity = 0;
    private intervalId = 0;

    ngOnInit() {
        // this.intervalId = setInterval(() => {
        //     this.lastActivity++;
        // }, 1000);
    }

    ngOnDestroy() {
        clearInterval(this.intervalId);
    }

    ngDoCheck() {
        console.log('ActivityFeed checked');
    }
}
