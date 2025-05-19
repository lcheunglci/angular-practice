import { Component, ViewChild, QueryList, ElementRef } from '@angular/core';
import { IWidget } from '../../IWidget';
import { QueryListChildComponent } from './query-list-child/query-list-child.component';

@Component({
  selector: 'query-list',
  templateUrl: './query-list-widget.component.html',
  styleUrls: ['./query-list-widget.component.scss']
})
export class QueryListWidgetComponent implements IWidget {
  widgetTitle = 'QueryList';
}
