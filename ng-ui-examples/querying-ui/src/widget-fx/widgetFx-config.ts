import { WidgetInfo } from './widget-info';
import { EmptyWidgetComponent } from './widgets/empty-widget/empty-widget.component';
import { QueryDecoratorWidgetComponent } from './widgets/query-decorator-widget/query-decorator-widget.component';
import { TemplateRefSelectorWidgetComponent } from './widgets/templateref-selector-widget/templateref-selector-widget.component';
import { ViewContainerRefWidgetComponent } from './widgets/view-container-ref-widget/view-container-ref-widget.component';
import { SelectorOptionsReadWidgetComponent } from './widgets/selector-options-read/selector-options-read-widget.component';
import { SelectorOptionsDescendantsWidgetComponent } from './widgets/selector-options-descendants/selector-options-descendants-widget.component';
import { QueryListWidgetComponent } from './widgets/query-list/query-list-widget.component';

export class WidgetFxConfig {
    private supportedWidgets: WidgetInfo[] = [];
    userSelectableWidgets: WidgetInfo[] = [];

    constructor() {
        this.setSupportedWidgets();
        this.setSelectableWidgets();
    }

    private setSupportedWidgets() {
        this.supportedWidgets.push(
            new WidgetInfo('None', 'empty', EmptyWidgetComponent)
        );
        this.supportedWidgets.push(
            new WidgetInfo('Query Decorators', 'query-decorators', QueryDecoratorWidgetComponent)
        );
        this.supportedWidgets.push(
            new WidgetInfo('TemplateRef Selectors', 'templateref-selectors', TemplateRefSelectorWidgetComponent)
        );
        this.supportedWidgets.push(
            new WidgetInfo('ViewContainerRef', 'view-container-ref', ViewContainerRefWidgetComponent)
        );
        this.supportedWidgets.push(
            new WidgetInfo('Selector Options - Read', 'selector-options-read', SelectorOptionsReadWidgetComponent)
        );
        this.supportedWidgets.push(
            new WidgetInfo('Selector Options - Descendants', 'selector-options-descendants', SelectorOptionsDescendantsWidgetComponent)
        );
        this.supportedWidgets.push(
            new WidgetInfo('QueryList', 'query-list', QueryListWidgetComponent)
        );
    }
    private setSelectableWidgets() {
        this.userSelectableWidgets = this.supportedWidgets.filter((itm) => {
            return itm.internalName !== 'about';
        });
    }
}

