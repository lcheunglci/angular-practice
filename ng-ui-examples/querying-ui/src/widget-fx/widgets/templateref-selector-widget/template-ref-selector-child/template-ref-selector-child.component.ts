import { Component, TemplateRef, ContentChild, ViewChild, ViewChildren, ContentChildren, QueryList } from '@angular/core';

@Component({
  selector: 'template-ref-selector-child-component',
  templateUrl: './template-ref-selector-child.component.html',
  styleUrls: ['./template-ref-selector-child.component.scss']
})
export class TemplateRefSelectorChildComponent {
  @ContentChildren(TemplateRef) allContent: QueryList<TemplateRef<any>>;
  @ViewChildren(TemplateRef) allViews: QueryList<TemplateRef<any>>;
  @ContentChildren('content1, content3') someContent: QueryList<TemplateRef<any>>;
  showChildCounts = false;

  countChildren() {
    this.showChildCounts = !this.showChildCounts;
    console.log(this.someContent);
  }
}
