import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerStatsComponent } from './server-stats.component';

describe('ServerStatsComponent', () => {
  let component: ServerStatsComponent;
  let fixture: ComponentFixture<ServerStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServerStatsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ServerStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
