import { WidgetInfo } from './widget-info';
import { EmptyWidgetComponent } from './widgets/empty-widget/empty-widget.component';
import { InputDecoratorWidgetComponent } from './widgets/input-decorator-widget/input-decorator-widget.component';
import { OuputDecoratorWidgetComponent } from './widgets/ouput-decorator-widget/ouput-decorator-widget.component';
import { PaywallDirectiveWidgetComponent } from './widgets/paywall-directive-widget/paywall-directive-widget.component';

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
            new WidgetInfo('Input Decorator', 'input-decorator', InputDecoratorWidgetComponent)
        );
        this.supportedWidgets.push(
            new WidgetInfo('Output Decorator', 'output-decorator', OuputDecoratorWidgetComponent)
        );
        this.supportedWidgets.push(
            new WidgetInfo('Paywall Directive', 'paywall-directive', PaywallDirectiveWidgetComponent)
        );
    }
    private setSelectableWidgets() {
        this.userSelectableWidgets = this.supportedWidgets.filter((itm) => {
            return itm.internalName !== 'about';
        });
    }
}

