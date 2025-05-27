import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularRatingComponent } from './angular-rating.component';
import { By } from '@angular/platform-browser';

describe('AngularRatingComponent', () => {
  let component: AngularRatingComponent;
  let fixture: ComponentFixture<AngularRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngularRatingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AngularRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 10 options if number 10 is passed as count', () => {
    component.count = 10;
    fixture.detectChanges();
    expect(component.options.length).toBe(10);
  });

  it('should have 10 options if number 10 is passed as count', () => {
    component.count = 10;
    component.rating = 5;
    fixture.detectChanges();
    const allWithClassRated = fixture.debugElement.queryAll(By.css('.rated'));
    expect(allWithClassRated.length).toBe(5);
  });
});
