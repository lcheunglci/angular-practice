import { Component, Input } from '@angular/core';

@Component({
  selector: 'sod-child2',
  templateUrl: './sod-child2.component.html',
  styleUrls: ['./sod-child2.component.scss']
})
export class SODChild2Component {
  @Input()location: string;
  Prop2 = 'This is a property on Child2';
  selected = '';

  sayHi() {
    alert('hello from Child 2');
  }
}
