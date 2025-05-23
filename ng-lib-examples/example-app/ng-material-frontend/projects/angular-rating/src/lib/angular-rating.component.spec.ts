import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularRatingComponent } from './angular-rating.component';

describe('AngularRatingComponent', () => {
  let component: AngularRatingComponent;
  let fixture: ComponentFixture<AngularRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngularRatingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AngularRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
