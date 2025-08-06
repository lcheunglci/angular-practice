import { ElementRef, Injector, runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { OnlineStatusDirective } from './online-status.directive';

class MockElementRef {
  constructor(public nativeElement: any) { }
}

describe('OnlineStatusDirective', () => {

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [{ provide: ElementRef, useValue: { nativeElement: { innerHTML: '' } } }]
    });
  });

  it('should create an instance', () => {
    const directive = runInInjectionContext(TestBed.inject(Injector), () => new OnlineStatusDirective());
    expect(directive).toBeTruthy();
  });
});
