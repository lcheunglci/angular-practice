import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-cockpit',
  standalone: true,
  imports: [],
  templateUrl: './cockpit.component.html',
  styleUrls: ['./cockpit.component.css'],
})
export class CockpitComponent {
  @Output() serverCreated = new EventEmitter<{
    serverName: string;
    serverContent: string;
  }>();

  @Output('bpCreated') blueprintCreated = new EventEmitter<{
    serverName: string;
    serverContent: string;
  }>();

  // newServerName = '';
  newServerContent = '';

  //onAddServer() {
  //  this.serverCreated.emit({
  //    serverName: this.newServerName,
  //    serverContent: this.newServerContent,
  //  });
  //}

  onAddServer(nameInput: HTMLInputElement) {
    console.log(nameInput.value);

    this.serverCreated.emit({
      serverName: nameInput.value,
      serverContent: this.newServerContent,
    });
  }

  onAddBlueprint(nameInput: HTMLInputElement) {
    this.blueprintCreated.emit({
      serverName: nameInput.value,
      serverContent: this.newServerContent,
    });
  }
}
