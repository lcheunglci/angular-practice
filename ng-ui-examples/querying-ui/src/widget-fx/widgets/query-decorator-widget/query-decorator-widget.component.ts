import { Component } from '@angular/core';
import { IWidget } from '../../IWidget';


@Component({
  selector: 'query-decorator-widget',
  templateUrl: './query-decorator-widget.component.html',
  styleUrls: ['./query-decorator-widget.component.scss']
})
export class QueryDecoratorWidgetComponent implements IWidget {
   widgetTitle = 'Query Decorators';
}
