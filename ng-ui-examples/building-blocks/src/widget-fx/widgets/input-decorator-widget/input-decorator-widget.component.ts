import { Component } from '@angular/core';
import { IWidget } from '../../IWidget';

@Component({
  selector: 'input-decorator-widget',
  templateUrl: './input-decorator-widget.component.html',
  styleUrls: ['./input-decorator-widget.component.scss']
})
export class InputDecoratorWidgetComponent implements IWidget {
  widgetTitle = 'Input Decorator';
  cubicle = 'AA-23';

  toggleUser() {
    this.cubicle = this.cubicle === 'AA-23'
      ? 'BB-08'
      : 'AA-23';
  }
}
