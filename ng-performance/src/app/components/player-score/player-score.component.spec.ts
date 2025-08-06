import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerScoreComponent } from './player-score.component';

describe('PlayerScoreComponent', () => {
  let component: PlayerScoreComponent;
  let fixture: ComponentFixture<PlayerScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerScoreComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PlayerScoreComponent);
    fixture.componentRef.setInput('score', 0.9999);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
