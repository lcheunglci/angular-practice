import * as i0 from '@angular/core';
import { Component, NgModule } from '@angular/core';

class SuperLibComponent {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: SuperLibComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: SuperLibComponent, selector: "super-lib-component", ngImport: i0, template: '<p>Hello from the library</p>', isInline: true });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: SuperLibComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'super-lib-component',
                    template: '<p>Hello from the library</p>',
                }]
        }] });

class SuperLibModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: SuperLibModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.12", ngImport: i0, type: SuperLibModule, declarations: [SuperLibComponent], exports: [SuperLibComponent] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: SuperLibModule });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: SuperLibModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [SuperLibComponent],
                    exports: [SuperLibComponent],
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { SuperLibComponent, SuperLibModule };
//# sourceMappingURL=super-lib.mjs.map
