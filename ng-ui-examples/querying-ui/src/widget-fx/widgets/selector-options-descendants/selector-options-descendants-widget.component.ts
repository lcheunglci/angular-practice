import { Component, ViewChild, ElementRef, AfterViewInit,
  ContentChild,
  QueryList,
  ContentChildren,
  ViewChildren} from '@angular/core';
import { IWidget } from '../../IWidget';
import { SODChildComponent } from './sod-child/sod-child.component';
import { SODChild2Component } from './sod-child2/sod-child2.component';
import { SODChild3Component } from './sod-child3/sod-child3.component';

@Component({
  selector: 'selector-options-descendants',
  templateUrl: './selector-options-descendants-widget.component.html',
  styleUrls: ['./selector-options-descendants-widget.component.scss']
})
export class SelectorOptionsDescendantsWidgetComponent implements IWidget {
  widgetTitle = 'Selector Options Descendants';

}
