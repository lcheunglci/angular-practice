import {
  Component, OnInit, Input, Output, EventEmitter,
  ElementRef, ViewChild, HostBinding
} from '@angular/core';

@Component({
  selector: 'help-banner, [helpComp]',
  templateUrl: './help-banner.component.html',
  styleUrls: ['./help-banner.component.scss']
})
export class HelpBannerComponent implements OnInit {

  @Output()
  help: EventEmitter<void> = new EventEmitter<void>();

  showHelpDeskLink = false;

  helpClicked() {
    this.help.emit();
  }

  ngOnInit() {
    this.showHelpDeskLink = this.help.observers.length > 0;

  }




}
