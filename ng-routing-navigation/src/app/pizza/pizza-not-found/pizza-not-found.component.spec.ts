import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PizzaNotFoundComponent } from './pizza-not-found.component';

describe('PizzaNotFoundComponent', () => {
  let component: PizzaNotFoundComponent;
  let fixture: ComponentFixture<PizzaNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PizzaNotFoundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PizzaNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
