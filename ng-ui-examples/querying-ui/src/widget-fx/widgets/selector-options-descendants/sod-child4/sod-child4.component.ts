import { Component, Input } from '@angular/core';

@Component({
  selector: 'sod-child4',
  templateUrl: './sod-child4.component.html',
  styleUrls: ['./sod-child4.component.scss']
})
export class SODChild4Component {
  @Input()location: string;
  Prop4 = 'This is a property on Child4';
  vc = false;
  cc = false;
  cc2 = false;
  cc3 = false;
}
