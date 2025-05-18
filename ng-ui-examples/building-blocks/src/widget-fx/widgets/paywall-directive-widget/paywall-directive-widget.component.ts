import { Component, AfterViewInit } from '@angular/core';
import { IWidget } from '../../IWidget';

@Component({
  selector: 'paywall-directive-widget',
  templateUrl: './paywall-directive-widget.component.html',
  styleUrls: ['./paywall-directive-widget.component.scss']
})
export class PaywallDirectiveWidgetComponent implements IWidget, AfterViewInit {
  widgetTitle = 'Paywall Directive';
  linkList: { title: string, licenseLevel: number }[] = [];

  ngAfterViewInit(): void {
    for (let i = 0; i < 10; i++) {
      this.linkList.push({
        title: 'Link #' + (i + 1),
        licenseLevel: Math.floor((Math.random() * 3) + 1)
      }
      );
    }
  }

}
