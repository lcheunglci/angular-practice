import * as i0 from '@angular/core';
import { Component } from '@angular/core';

class SuperLibComponent {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: SuperLibComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: SuperLibComponent, isStandalone: true, selector: "super-lib-component", ngImport: i0, template: "<p>Hello from an external template</p>\n" });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: SuperLibComponent, decorators: [{
            type: Component,
            args: [{ selector: 'super-lib-component', standalone: true, template: "<p>Hello from an external template</p>\n" }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { SuperLibComponent };
//# sourceMappingURL=super-lib.mjs.map
