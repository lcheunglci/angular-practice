import { Component } from '@angular/core';
import { IWidget } from '../../IWidget';


@Component({
  selector: 'templateref-selector-widget',
  templateUrl: './templateref-selector-widget.component.html',
  styleUrls: ['./templateref-selector-widget.component.scss']
})
export class TemplateRefSelectorWidgetComponent implements IWidget {
   widgetTitle = 'TemplateRef Selectors';
}
