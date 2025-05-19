import { Component, TemplateRef, ContentChild,
  ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'toggle-view-content',
  templateUrl: './toggle-view-content.component.html',
  styleUrls: ['./toggle-view-content.component.scss']
})
export class ToggleViewContentComponent implements AfterViewInit {
  @ContentChild('content') content: TemplateRef<any>;
  @ViewChild('view') view: TemplateRef<any>;
  showViewTemplate = true;
  liveTemplate: TemplateRef<any>;

  ngAfterViewInit(): void {
    setTimeout( () => {
      this.liveTemplate = this.view;
    }, 0);
  }

  toggleTemplateSelected() {
    this.showViewTemplate = !this.showViewTemplate;
    this.liveTemplate = this.showViewTemplate ? this.view : this.content;
  }
}
