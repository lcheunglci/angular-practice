import {
  Component, ContentChildren, AfterViewInit, ViewChildren,
  ViewChild, ContentChild, QueryList, Input
} from '@angular/core';
import { SODChild2Component } from '../sod-child2/sod-child2.component';
import { SODChild3Component } from '../sod-child3/sod-child3.component';
import { SODChild4Component } from '../sod-child4/sod-child4.component';
import { templateVisitAll } from '@angular/compiler';

@Component({
  selector: 'sod-child',
  templateUrl: './sod-child.component.html',
  styleUrls: ['./sod-child.component.scss']
})
export class SODChildComponent implements AfterViewInit {
  @ViewChildren(SODChild3Component)
    viewChildren: QueryList<SODChild3Component>;
  @ContentChildren(SODChild3Component)
    contentChildren: QueryList<SODChild3Component>;
  @ContentChildren(SODChild3Component, { descendants: true })
    contentChildren2: QueryList<SODChild3Component>;
  @ContentChildren(SODChild4Component, { descendants: true })
    contentChildren3: QueryList<SODChild4Component>;
    @ContentChild(SODChild4Component) contentChild: SODChild4Component;
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.viewChildren.forEach((child) => {
        child.vc = true;
      });
      this.contentChildren.forEach((child) => {
        child.cc = true;
      });
      this.contentChildren2.forEach((child) => {
        child.cc2 = true;
      });
      this.contentChildren3.forEach((child) => {
        child.cc2 = true;
      });
      if (this.contentChild) {
        this.contentChild.cc3 = true;
      }

    }, 0);
  }


}
