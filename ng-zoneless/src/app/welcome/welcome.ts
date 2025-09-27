import { ChangeDetectionStrategy, Component, effect, inject, InjectionToken, Injector, viewChild, ViewContainerRef } from '@angular/core';
import { MessageComponent } from './message/message';

export const WELCOME_MESSAGE = new InjectionToken<string>('welcomeMessage');

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.html',
    styleUrls: ['./welcome.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeComponent {
    private container = viewChild.required('container', { read: ViewContainerRef });
    private injector = inject(Injector);

    constructor() {
        effect(() => {
            if (this.container()) {
                this.createWelcomeMessage();
            }
        });
    }

    private createWelcomeMessage() {
        // 1. -------------------------------------------- Before
        // const customInjector = Injector.create({
        //     providers: [
        //         { provide: WELCOME_MESSAGE, useValue: 'Welcome to the app!' }
        //     ],
        //     parent: this.injector
        // });
        // const componentRef = this.container().createComponent(MessageComponent, {
        //     injector: customInjector
        // });

        // setTimeout(() => {
        //     componentRef.instance.welcomeMessage = `We're glad to have you back!`;
        // }, 2000);

        // 2. -------------------------------------------- input() and setInput()
        const componentRef = this.container().createComponent(MessageComponent);
        componentRef.setInput('welcomeMessage', 'Welcome to the app!');

        setTimeout(() => {
            componentRef.setInput('welcomeMessage', `We're glad to have you back`);
        }, 2000);
    }
}