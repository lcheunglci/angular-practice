import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FooterComponent } from './footer/footer';
import { MainContentComponent } from './main-content/main-content';
import { ProductDetailsComponent } from './product-details/product-details';
import { ProductToolbarComponent } from './product-toolbar/product-toolbar';
import { ProductsComponent } from './products/products';
import { ScrollInsightsComponent } from './scroll-insights/scroll-insights';
import { SessionTimerComponent } from './session-timer/session-timer';
import { SidebarComponent } from './sidebar/sidebar';

@Component({
    selector: 'app-root',
    templateUrl: './app.html',
    styleUrl: './app.scss',
    imports: [
        SidebarComponent, 
        MainContentComponent, 
        FooterComponent, 
        // SessionTimerComponent, 
        // ScrollInsightsComponent, 
        // ProductsComponent,
        // ProductDetailsComponent,
        // ProductToolbarComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
}
