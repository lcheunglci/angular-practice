import { Component } from '@angular/core';

@Component({
  selector: 'app-servers',
  //selector: '[app-servers]', // select by attribute name
  //selector: '.app-servers', // select by class
  //template: `<app-server></app-server>
  //  <app-server></app-server> `,
  templateUrl: './servers.component.html',
  styleUrl: './servers.component.css',
})
export class ServersComponent {
  allowNewServer = false;
  serverCreationStatus = 'No server was created!';
  /**
   *
   */
  constructor() {
    setTimeout(() => {
      this.allowNewServer = true;
    }, 2000);
  }

  ngOnInit() {}

  onCreateServer() {
    this.serverCreationStatus = 'Server was created';
  }
}
