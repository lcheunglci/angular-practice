import { Component, inject } from '@angular/core';
import { ServerStatsComponent } from './components/server-stats/server-stats.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MessageService } from './services/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, ServerStatsComponent]
})
export class App {
  public messageService = inject(MessageService);
}
