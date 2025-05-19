
import { IWidget } from './IWidget';
import { Type } from '@angular/core';


export class WidgetInfo {
    displayName: string;
    internalName: string;
    widgetType: Type<IWidget>;

    constructor(displayName: string, internalName: string, widgetType: Type<IWidget>) {
        this.displayName = displayName;
        this.internalName = internalName;
        this.widgetType = widgetType;
    }
}

