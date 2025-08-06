import { booleanAttribute, Component, input, output } from '@angular/core';
import { Player } from '../../interfaces/player';
import { PlayerGemsComponent } from '../player-gems/player-gems.component';
import { PlayerScoreComponent } from '../player-score/player-score.component';

@Component({
  selector: 'app-player-list',
  imports: [PlayerGemsComponent, PlayerScoreComponent],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.css'
})
export class PlayerListComponent {
  public players = input.required<Player[]>();

  public score = input(false, { alias: 'show-score', transform: booleanAttribute });

  public gems = input(false, { alias: 'show-gems', transform: booleanAttribute });

  public selected = output<Player>();
}
