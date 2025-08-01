import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { App } from './app';

describe('App', () => {


  let component: App;
  let fixture: ComponentFixture<App>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule],
      declarations: [App]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it ('should have a title', () => {
    const compiled = fixture.nativeElement;
    const title = compiled.querySelector('h2').textContent;
    expect(title).toBe('Active Users');
  })


  // beforeEach(async () => {
  //   await TestBed.configureTestingModule({
  //     imports: [
  //       RouterModule.forRoot([])
  //     ],
  //     declarations: [
  //       App
  //     ],
  //   }).compileComponents();
  // });

  // it('should create the app', () => {
  //   const fixture = TestBed.createComponent(App);
  //   const app = fixture.componentInstance;
  //   expect(app).toBeTruthy();
  // });

  // it('should render title', () => {
  //   const fixture = TestBed.createComponent(App);
  //   fixture.detectChanges();
  //   const compiled = fixture.nativeElement as HTMLElement;
  //   expect(compiled.querySelector('h1')?.textContent).toContain('Hello, ng-test-and-debug');
  // });
});
