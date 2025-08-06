import { Component, OnInit, signal } from '@angular/core';
import { Server } from '../../interfaces/server';

@Component({
  selector: 'app-server-stats',
  templateUrl: './server-stats.component.html',
  styleUrl: './server-stats.component.css'
})
export class ServerStatsComponent implements OnInit {
  public server = signal<Server>({ status: '?', closest: '?', latency: '?' });
  public synchronized = signal(false);

  ngOnInit(): void {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker(new URL('./server-stats.worker', import.meta.url));

      worker.onmessage = (event: MessageEvent<Server>) => this.server.set(event.data);

      worker.postMessage({ url: 'mocks/server.json' });
    } else {
      this.server.set({ status: 'ERROR', closest: 'ERROR', latency: 'ERROR' });
    }
  }
}
