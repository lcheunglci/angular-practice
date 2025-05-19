import { Component, ViewChild, QueryList, ElementRef,
  AfterViewInit } from '@angular/core';
import { IWidget } from '../../IWidget';
import { SORChildComponent } from './sor-child/sor-child.component';

@Component({
  selector: 'selector-options-read',
  templateUrl: './selector-options-read-widget.component.html',
  styleUrls: ['./selector-options-read-widget.component.scss']
})
export class SelectorOptionsReadWidgetComponent implements IWidget, AfterViewInit {
  widgetTitle = 'Selector Options Read';
  // A
  @ViewChild(SORChildComponent) child: SORChildComponent;
  @ViewChild('child') child2: SORChildComponent;

  // B
   @ViewChild(SORChildComponent, {read: ElementRef}) childElem: ElementRef;
   @ViewChild('child', {read: ElementRef}) child2Elem: ElementRef;

  // C
   @ViewChild('title') title: ElementRef;
   @ViewChild('title', {read: ElementRef}) titleElem: ElementRef;

  ngAfterViewInit(): void {
    // B
     console.log(this.childElem);
     console.log(this.child2Elem);

    // C
     console.log(this.title);
     console.log(this.titleElem);
  }
}
