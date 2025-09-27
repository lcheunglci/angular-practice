import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { WELCOME_MESSAGE } from '../welcome';

@Component({
    selector: 'app-message',
    templateUrl: './message.html',
    styleUrls: ['./message.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageComponent {
    // 1. -------------------------------------------- Before
    // private message = inject(WELCOME_MESSAGE);
    // welcomeMessage: string = this.message;

    // 2. -------------------------------------------- input() and setInput()
    readonly welcomeMessage = input.required<string>();
}