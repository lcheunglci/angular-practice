import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { PlayerListComponent } from '../../components/player-list/player-list.component';
import { Player } from '../../interfaces/player';
import { SortByGemCountPipe } from '../../pipes/sort-by-gem-count.pipe';
import { SortByScorePipe } from '../../pipes/sort-by-score.pipe';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-leaderboards',
  templateUrl: './leaderboards.component.html',
  styleUrl: './leaderboards.component.css',
  imports: [CommonModule, PlayerListComponent, SortByGemCountPipe, SortByScorePipe],
})
export class LeaderboardsComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private playerService = inject(PlayerService);
  private router = inject(Router);

  private CACHE_NAME = 'LeaderboardsComponentCache';

  public players = signal<Player[]>([]);
  public synchronized = signal(false);

  ngOnInit(): void {
    this.playerService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (players) => {
          if (!players) return;

          this.players.set(players);
          sessionStorage.setItem(this.CACHE_NAME, JSON.stringify(players));
          this.synchronized.set(true);
        }
      });

    if (this.synchronized()) return;

    const cached = JSON.parse(sessionStorage.getItem(this.CACHE_NAME) ?? 'null');

    if (cached) this.players.set(cached);
  }

  public goto({ id }: Player) {
    return this.router.navigateByUrl(`/profile/${id}`);
  }
}
