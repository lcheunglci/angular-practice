import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule, MatGridListModule } from '@angular/material';
import { WidgetZoneComponent } from './widget-zone/widget-zone.component';
import { EmptyWidgetComponent } from './widgets/empty-widget/empty-widget.component';
import { QueryDecoratorWidgetComponent } from './widgets/query-decorator-widget/query-decorator-widget.component';
import { ToggleViewContentComponent } from './widgets/query-decorator-widget/toggle-view-content/toggle-view-content.component';
import { TemplateRefSelectorWidgetComponent } from './widgets/templateref-selector-widget/templateref-selector-widget.component';
import { ViewContainerRefWidgetComponent } from './widgets/view-container-ref-widget/view-container-ref-widget.component';
import { SelectorOptionsReadWidgetComponent } from './widgets/selector-options-read/selector-options-read-widget.component';
import { SORChildComponent } from './widgets/selector-options-read/sor-child/sor-child.component';
import { TemplateRefSelectorChildComponent } from './widgets/templateref-selector-widget/template-ref-selector-child/template-ref-selector-child.component';
import { SODChildComponent } from './widgets/selector-options-descendants/sod-child/sod-child.component';
import { SODChild2Component } from './widgets/selector-options-descendants/sod-child2/sod-child2.component';
import { SODChild3Component } from './widgets/selector-options-descendants/sod-child3/sod-child3.component';
import { SelectorOptionsDescendantsWidgetComponent } from './widgets/selector-options-descendants/selector-options-descendants-widget.component';
import { SODChild4Component } from './widgets/selector-options-descendants/sod-child4/sod-child4.component';
import { QueryListWidgetComponent } from './widgets/query-list/query-list-widget.component';
import { QueryListChildComponent } from './widgets/query-list/query-list-child/query-list-child.component';

@NgModule({
    imports: [
        CommonModule,
        MatMenuModule,
        MatGridListModule,

    ],
    declarations: [
        WidgetZoneComponent,
        EmptyWidgetComponent,
        QueryDecoratorWidgetComponent,
        ToggleViewContentComponent,
        TemplateRefSelectorWidgetComponent,
        TemplateRefSelectorChildComponent,
        ViewContainerRefWidgetComponent,
        SelectorOptionsReadWidgetComponent,
        SORChildComponent,
        SelectorOptionsDescendantsWidgetComponent,
        SODChildComponent,
        SODChild2Component,
        SODChild3Component,
        SODChild4Component,
        QueryListWidgetComponent,
        QueryListChildComponent
    ],
    entryComponents: [
        EmptyWidgetComponent,
        QueryDecoratorWidgetComponent,
        TemplateRefSelectorWidgetComponent,
        ViewContainerRefWidgetComponent,
        SelectorOptionsReadWidgetComponent,
        SelectorOptionsDescendantsWidgetComponent,
        QueryListWidgetComponent
    ],
    exports: [
        WidgetZoneComponent
    ],
    providers: [],
})
export class WidgetFxModule { }
