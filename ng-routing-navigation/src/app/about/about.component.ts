import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MESSAGE_SERVICE } from '../services/message.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class AboutComponent {
  protected readonly messageService = inject(MESSAGE_SERVICE, {
    optional: true,
  });
}
