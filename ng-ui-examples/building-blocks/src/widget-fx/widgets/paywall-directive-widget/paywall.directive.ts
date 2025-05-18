import { Directive, OnInit, ElementRef, Input, Renderer2 } from '@angular/core';
import { LicenseConfigService } from '../../../app/license-config.service';

@Directive({
  selector: '[hsPaywall]'
})
export class PaywallDirective implements OnInit {
  @Input() requiredLicense: number;
  elm: HTMLElement;

  constructor(element: ElementRef, private ren: Renderer2, private cfg: LicenseConfigService) {
    if (element && element.nativeElement) {
      this.elm = element.nativeElement;
    }
  }

  private checkLink(element: HTMLAnchorElement) {
    if (this.requiredLicense > this.cfg.currentLicense) {

      const span = this.ren.createElement('span');
      this.ren.addClass(span, 'paywall');
      span.title = 'Requires additional license purchase';

      const txt = this.ren.createText('[$]');
      this.ren.appendChild(span, txt);
      const parent = this.ren.parentNode(element);
      this.ren.appendChild(parent, span);
    }
  }

  ngOnInit(): void {
    if (this.elm && this.elm instanceof HTMLAnchorElement) {
      this.checkLink(this.elm as HTMLAnchorElement);
    }
  }

}
