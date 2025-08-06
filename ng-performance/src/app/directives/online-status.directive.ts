import { AfterContentInit, Directive, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: '[appOnlineStatus]'
})
export class OnlineStatusDirective implements AfterContentInit {
  private element = inject(ElementRef<HTMLElement>);

  public appOnlineStatus = input.required<boolean>();

  public ngAfterContentInit(): void {
    if (this.appOnlineStatus() === true) {
      this.element.nativeElement.innerHTML += '<i class="bi bi-lightning-fill"></i>';
    }
  }
}
