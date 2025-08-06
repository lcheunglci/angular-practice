import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerGemsComponent } from './player-gems.component';

describe('PlayerGemsComponent', () => {
  let component: PlayerGemsComponent;
  let fixture: ComponentFixture<PlayerGemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerGemsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PlayerGemsComponent);
    fixture.componentRef.setInput('count', 9999);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
