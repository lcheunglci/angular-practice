import { Component } from '@angular/core';
import { IWidget } from '../../IWidget';

@Component({
  selector: 'empty-widget',
  templateUrl: './empty-widget.component.html',
  styleUrls: ['./empty-widget.component.scss']
})
export class EmptyWidgetComponent implements IWidget {
   widgetTitle = '';

}
