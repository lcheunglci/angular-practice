import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MessageService } from './services/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css',
})
export class AppComponent {
  public appFooter = environment.appFooter;

  constructor(public messageService: MessageService) {}
}
