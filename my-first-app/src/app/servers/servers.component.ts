import { Component } from '@angular/core';

@Component({
  selector: 'app-servers',
  //selector: '[app-servers]', // select by attribute name
  //selector: '.app-servers', // select by class
  template: `<app-server></app-server>
    <app-server></app-server> `,
  styleUrl: './servers.component.css',
})
export class ServersComponent {}
