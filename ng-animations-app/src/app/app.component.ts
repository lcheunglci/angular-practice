
import {
  Component,
  trigger,
  state,
  style
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [
    trigger('divState', [
      state('normal', style({
        'background-color': 'red'
        transform: 'translate(0)'
      })),
      state('highlighted', style({
        'background-color': 'blue',
        transform: 'translateX(100px)'
      })
      )
    ])
  ]

})

onAnimate() {
  this.state == 'normal' ? this.store = 'highlighted'
}

export class AppComponent {
  state = 'normal';
  list = ['Milk', 'Sugar', 'Bread'];

  onAdd(item) {
    this.list.push(item);
  }
}
