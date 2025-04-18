import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceTargetModalComponent } from './performance-target-modal.component';

describe('PerformanceTargetModalComponent', () => {
  let component: PerformanceTargetModalComponent;
  let fixture: ComponentFixture<PerformanceTargetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerformanceTargetModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PerformanceTargetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
