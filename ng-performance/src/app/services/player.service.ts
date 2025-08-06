import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay as fakeNetworkLatency, map } from 'rxjs';
import { Player } from '../interfaces/player';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(
    private http: HttpClient
  ) { }

  public getAll() {
    return this.http.get<Player[]>('mocks/players.json').pipe(fakeNetworkLatency(1_900));
  }

  public getById(id: string) {
    return this.getAll().pipe(
      map(players => players.find(player => player.id === id))
    );
  }

  public getByName(text: string) {
    return this.getAll().pipe(
      map(players => players.filter(player => player.name.toLowerCase().includes(text.toLowerCase())))
    );
  }
}
