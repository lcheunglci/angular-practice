import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../interfaces/player';

@Pipe({
  name: 'sortByGemCount'
})
export class SortByGemCountPipe implements PipeTransform {

  public transform(players: readonly Player[]): Player[] {
    return players.toSorted((a, b) => b.gems.length - a.gems.length);
  }

}
