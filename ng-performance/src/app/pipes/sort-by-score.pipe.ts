import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../interfaces/player';

@Pipe({
  name: 'sortByScore'
})
export class SortByScorePipe implements PipeTransform {

  public transform(players: readonly Player[]): Player[] {
    return players.toSorted((a, b) => b.score - a.score);
  }

}
