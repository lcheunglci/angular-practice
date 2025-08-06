import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { delay as fakeNetworkLatency } from 'rxjs';
import { Message } from '../interfaces/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  public unread = signal<Message[]>([]);

  public count = computed(() => this.unread().length);

  constructor(
    private http: HttpClient,
  ) {
    this.http
      .get<Message[]>('mocks/messages.json')
      .pipe(fakeNetworkLatency(1_900), takeUntilDestroyed())
      .subscribe({
        next: items => this.unread.set(items)
      });
  }

  public delete(selected: Message) {
    this.unread.update(items => {
      return items.filter((item) => item.id !== selected.id);
    });
  }
}
