import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { CatalogComponent } from './catalog/catalog.component';
import { SiteHeaderComponent } from './site-header/site-header.component';
import { UserModule } from './user/user.module';


@Component({
    selector: 'bot-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, HomeComponent, CatalogComponent, SiteHeaderComponent, UserModule]
})
export class AppComponent {
  title = 'joes-robot-shop';
}
