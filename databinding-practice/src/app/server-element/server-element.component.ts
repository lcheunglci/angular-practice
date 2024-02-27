import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-server-element',
  standalone: true,
  imports: [],
  templateUrl: './server-element.component.html',
  styleUrls: ['./server-element.component.css'],
})
export class ServerElementComponent {
  @Input() element: { type: string; name: string; content: string };

  constructor() {}

  ngOnInit() {}
}
