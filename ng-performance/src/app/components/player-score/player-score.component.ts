import { CommonModule } from '@angular/common';
import { Component, input, numberAttribute } from '@angular/core';

@Component({
  selector: 'app-player-score',
  imports: [CommonModule],
  templateUrl: './player-score.component.html',
  styleUrl: './player-score.component.css'
})
export class PlayerScoreComponent {
  public score = input.required({ transform: numberAttribute });
}
