import { CommonModule } from '@angular/common';
import { Component, input, numberAttribute } from '@angular/core';

@Component({
  selector: 'app-player-gems',
  imports: [CommonModule],
  templateUrl: './player-gems.component.html',
  styleUrl: './player-gems.component.css'
})
export class PlayerGemsComponent {
  public count = input.required({ transform: numberAttribute });
}
