import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule, MatGridListModule } from '@angular/material';
import { WidgetZoneComponent } from './widget-zone/widget-zone.component';
import { EmptyWidgetComponent } from './widgets/empty-widget/empty-widget.component';
import { InputDecoratorWidgetComponent } from './widgets/input-decorator-widget/input-decorator-widget.component';
import { PersonComponent } from './widgets/input-decorator-widget/person-component/person-component';
import { OuputDecoratorWidgetComponent } from './widgets/ouput-decorator-widget/ouput-decorator-widget.component';
import { HelpBannerComponent } from './widgets/ouput-decorator-widget/help-banner/help-banner.component';
import { PaywallDirectiveWidgetComponent } from './widgets/paywall-directive-widget/paywall-directive-widget.component';
import { PaywallDirective } from './widgets/paywall-directive-widget/paywall.directive';



@NgModule({
    imports: [
        CommonModule,
        MatMenuModule,
        MatGridListModule,

    ],
    declarations: [
        WidgetZoneComponent,
        EmptyWidgetComponent,
        InputDecoratorWidgetComponent,
        PersonComponent,
        OuputDecoratorWidgetComponent,
        HelpBannerComponent,
        PaywallDirectiveWidgetComponent,
        PaywallDirective
    ],
    entryComponents: [
        EmptyWidgetComponent,
        InputDecoratorWidgetComponent,
        OuputDecoratorWidgetComponent,
        PaywallDirectiveWidgetComponent
    ],
    exports: [
        WidgetZoneComponent,
        PaywallDirective
    ],
    providers: [],
})
export class WidgetFxModule { }
