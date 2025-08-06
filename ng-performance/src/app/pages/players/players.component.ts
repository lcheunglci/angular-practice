import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { PlayerListComponent } from '../../components/player-list/player-list.component';
import { Player } from '../../interfaces/player';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css'],
  imports: [AsyncPipe, CommonModule, FormsModule, PlayerListComponent]
})
export class PlayersComponent implements OnInit {
  private playerService = inject(PlayerService);
  private router = inject(Router);

  public players$: Observable<Player[] | undefined> = of(undefined);

  public filterText = '';

  public ngOnInit(): void {
    this.players$ = this.playerService.getAll();
  }

  public update(text: string) {
    this.players$ = this.playerService.getByName(text);
  }

  public goto({ id }: Player) {
    return this.router.navigateByUrl(`/profile/${id}`);
  }
}
