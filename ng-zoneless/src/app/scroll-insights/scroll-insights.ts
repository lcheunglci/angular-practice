import { DecimalPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    inject,
    Renderer2,
    signal,
    viewChild
} from '@angular/core';
import { getOrders } from './scroll-insights.data';

@Component({
    selector: 'app-scroll-insights',
    templateUrl: './scroll-insights.html',
    styleUrl: './scroll-insights.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DecimalPipe],
})
export class ScrollInsightsComponent {
    // 1. / 2.
    // protected scrollTop = 0;
    // protected startIndex = 0;

    // 3. --------------------------------------------- Signals
    protected scrollTop = signal(0);
    protected startIndex = signal(0);

    protected readonly totalItems = 100;
    protected readonly orders = getOrders(this.totalItems);

    private readonly scrollerRef = viewChild<ElementRef<HTMLDivElement>>('scroller');
    private renderer = inject(Renderer2);
    private destroyRef = inject(DestroyRef);
    private readonly rowHeight = 56;
    
    // 1. / 2.
    // protected endIndex = Math.ceil(380 / this.rowHeight);

    // 3.
    protected endIndex = signal(Math.ceil(380 / this.rowHeight));

    // 2. --------------------------------------------- Change Detector Ref
    // private readonly cdRef = inject(ChangeDetectorRef);

    ngAfterViewInit(): void {
        const el = this.scrollerRef()?.nativeElement;
        if (!el) return;

        const onScroll = () => {
            // 1.
            // this.scrollTop = el.scrollTop;

            // const first = Math.floor(this.scrollTop / this.rowHeight);
            // const visible = Math.max(1, Math.ceil(el.clientHeight / this.rowHeight));
            // this.startIndex = Math.max(0, Math.min(this.totalItems - 1, first));
            // this.endIndex = Math.min(this.totalItems, this.startIndex + visible);

            // 2. --------------------------------------------- Change Detector Ref
            // this.cdRef.markForCheck();

            // 3. --------------------------------------------- Signals
            this.scrollTop.set(el.scrollTop);

            const first = Math.floor(this.scrollTop() / this.rowHeight);
            const visible = Math.max(1, Math.ceil(el.clientHeight / this.rowHeight));
            this.startIndex.set(Math.max(0, Math.min(this.totalItems - 1, first)));
            this.endIndex.set(Math.min(this.totalItems, this.startIndex() + visible));
        };

        const unlisten = this.renderer.listen(el, 'scroll', onScroll);
        this.destroyRef.onDestroy(() => unlisten());
    }
}
