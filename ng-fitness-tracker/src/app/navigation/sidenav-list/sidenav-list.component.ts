import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrl: './sidenav-list.component.css',
})
export class SidenavListComponent {
  @Output() closeSideNav = new EventEmitter<void>();

  onClose() {
    this.closeSideNav.emit();
  }
}
