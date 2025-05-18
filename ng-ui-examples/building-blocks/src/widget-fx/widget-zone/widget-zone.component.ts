import {
    Component, Input, Type, ViewChild, ViewContainerRef, ComponentRef, ViewEncapsulation,
    ElementRef, Injector, ComponentFactoryResolver
} from '@angular/core';

import { IWidget } from '../IWidget';

import { EmptyWidgetComponent } from '../widgets/empty-widget/empty-widget.component';
import { WidgetInfo } from '../widget-info';
import { WidgetFxConfig } from '../widgetFx-config';

@Component({
    selector: 'widget-zone',
    templateUrl: './widget-zone.component.html',
    styleUrls: ['./widget-zone.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class WidgetZoneComponent {

    private defaultWidget: Type<IWidget>;
    @Input() height: any = 'calc(100% - 8px)';
    @Input() width: any = 'calc(100% - 8px)';
    @ViewChild('vc', { read: ViewContainerRef }) vc: ViewContainerRef;

    activeWidgetTitle: string;
    activeWidget: IWidget;
    cfg: WidgetFxConfig = new WidgetFxConfig();
    constructor(private injector: Injector,
        private cfr: ComponentFactoryResolver) {

    }
    public ChangeWidgetType(newType: WidgetInfo) {
        if (!newType.widgetType) {
            newType.widgetType = EmptyWidgetComponent;
        }
        const factory = this.cfr.resolveComponentFactory(newType.widgetType);
        const componentRef = factory.create(this.injector);
        this.vc.clear();
        this.vc.insert(componentRef.hostView);
        this.activeWidget = componentRef.instance;
        this.activeWidgetTitle = this.activeWidget.widgetTitle;
    }


    public customTrackBy(index: number, obj: any): any {
        return index;
    }

}

