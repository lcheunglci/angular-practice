import { ChangeDetectionStrategy, Component, DoCheck } from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements DoCheck {
    ngDoCheck() {
        console.log('Footer checked');
    }
}
