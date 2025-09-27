import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';

@Component({
  selector: 'app-session-timer',
  templateUrl: './session-timer.html',
  styleUrls: ['./session-timer.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionTimerComponent {
    readonly total = 15;
    readonly warnAt = 10;
    readonly dangerAt = 5;

    private readonly destroyRef = inject(DestroyRef);

    // 1. / 2.
    // protected secondsRemaining = this.total;
    // protected formattedRemaining = this.formatMMSS(this.secondsRemaining);

    // 3. --------------------------------------------- Signals
    protected readonly secondsRemaining = signal(this.total);
    protected readonly formattedRemaining = computed(() => this.formatMMSS(this.secondsRemaining()));

    // 2. --------------------------------------------- Change Detector Ref
    // private cdRef = inject(ChangeDetectorRef);

    // 1. / 2.
    constructor() {
        const timerId = setInterval(() => {
            // 1. / 2.
            // this.secondsRemaining = Math.max(this.secondsRemaining - 1, 0);
            // this.formattedRemaining = this.formatMMSS(this.secondsRemaining);

            // 2. --------------------------------------------- Change Detector Ref
            // this.cdRef.markForCheck();

            // 3. --------------------------------------------- Signals
            this.secondsRemaining.update(v => Math.max(v - 1, 0));
        }, 1000);
      
        this.destroyRef.onDestroy(() => clearInterval(timerId));
    }

    private formatMMSS(totalSeconds: number): string {
        return new Date(totalSeconds * 1000).toISOString().slice(14, 19);
    }
}
