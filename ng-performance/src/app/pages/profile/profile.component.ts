import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Player } from '../../interfaces/player';
import { PlayerService } from '../../services/player.service';

const playerDetailsCache = new Map<Player['id'], Player>();

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule, NgOptimizedImage, ReactiveFormsModule]
})
export class ProfileComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private playerService = inject(PlayerService);

  public id = input.required<Player['id']>();

  public player = signal<Player | undefined>(undefined);
  public synchronized = signal(false);

  public msgForm = new FormGroup({
    msg: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ])
  });

  ngOnInit(): void {
    this.playerService.getById(this.id())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (fetched) => {
          if (!fetched) return;

          this.player.set(fetched);
          playerDetailsCache.set(this.id(), fetched);
          this.synchronized.set(true);
        }
      });

    if (this.synchronized()) return;

    const cached = playerDetailsCache.get(this.id());

    if (cached) this.player.set(cached);
  }

  submit(): void {
    this.msgForm.reset();
  }
}
