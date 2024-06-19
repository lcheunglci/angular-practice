
import {
  Component,
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
  group
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [
    trigger('divState', [
      state('normal', style({
        'background-color': 'red',
        transform: 'translate(0)'
      })),
      state('highlighted', style({
        'background-color': 'blue',
        transform: 'translateX(100px)'
      })),
      transition('normal <=> highlighted', animate(300)),
      // transition('highlighted => normal', animate(800))
    ]),
    trigger('wildState', [
      state('normal', style({
        'background-color': 'red',
        transform: 'translate(0) scale(1)'
      })),
      state('highlighted', style({
        'background-color': 'blue',
        transform: 'translateX(100px) scale(1)'
      })),
      state('shrunken', style({
        'background-color': 'green',
        transform: 'translateX(0px) scale(0.5)'
      })),

      transition('normal => highlighted', animate(300)),
      transition('highlighted => normal', animate(800)),
      transition('shrunken <=> *', [
        style({
          'background-color': 'orange'
        }),
        animate(1000, style({
          borderRadius: '50px'
        })),
        animate(500)
      ])
    ]),
    trigger('list1', [
      state('in', style({
        opaity: 1,
        transform: 'translateX(0)'
      })),
      transition('void <=> *', [
        style({
          opacity: 0,
          transform: 'translateX(-100px)'
        }),
        animate(300)]),
      transition('* <=> void', [
        animate(300, style({
          transform: 'translateX(100px)',
          opacity: 0
        })
        )
      ])
    ]),
    trigger('list2', [
      state('in', style({
        opaity: 1,
        transform: 'translateX(0)'
      })),
      transition('void <=> *', [
        animate(1000, keyframes([
          style({
            opacity: 0,
            transform: 'translateX(-100px)',
            offset: 0
          }),
          style({
            opacity: 0.5,
            transform: 'translateX(-50px)',
            offset: 0.3,
          }),
          style({
            opacity: 1,
            transform: 'translateX(-20px)',
            offset: 0.8
          }),
          style({
            opacity: 1,
            transform: 'translateX(0px)',
            offset: 1
          }),
        ]))
      ]),
      transition('* <=> void', [
        group([
          animate(300, style({
            color: 'red'
          })),
          animate(800, style({
            transform: 'translateX(100px)',
            opacity: 0
          })
          )
        ])
      ])
    ])

  ]
})
export class AppComponent {
  state = 'normal';
  wildState = 'normal';
  list = ['Milk', 'Sugar', 'Bread'];

  onAnimate() {
    this.state == 'normal' ? this.state = 'highlighted' : this.state = 'normal'
  }

  onShrink() {
    this.wildState = 'shrunken';
    this.wildState == 'normal' ? this.state = 'highlighted' : this.state = 'normal'
  }

  onAdd(item) {
    this.list.push(item);
  }
}
