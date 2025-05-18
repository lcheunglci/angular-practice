import { Component } from '@angular/core';
import { IWidget } from '../../IWidget';

@Component({
  selector: 'ouput-decorator-widget',
  templateUrl: './ouput-decorator-widget.component.html',
  styleUrls: ['./ouput-decorator-widget.component.scss']
})
export class OuputDecoratorWidgetComponent implements IWidget {
  widgetTitle = 'Ouput Decorator';
  err = false;
  handler = true;

  showHelp() {
    alert('This code is in the parent component.  Collect error information and redirect to help desk...');
  }

  toggleHandler() {
    this.handler = !this.handler;
  }
  toggleErr() {
    this.err = !this.err;
  }
}
