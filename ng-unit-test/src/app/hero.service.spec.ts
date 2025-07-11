import { inject, TestBed } from '@angular/core/testing';
import { HeroService } from './hero.service';
import { MessageService } from './message.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('HeroService', () => {
  let mockMessageService;
  let httpTestingController: HttpTestingController;
  let service: HeroService;

  beforeEach(() => {
    mockMessageService = jasmine.createSpyObj(['add']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HeroService,
        { provide: MessageService, useValue: mockMessageService },
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    // let msgSvc = TestBed.inject(MessageService);
    service = TestBed.inject(HeroService);
  });

  // There are 2 ways to inject the service in the test, one is using inject wrapped around the callback, and the other is in the beforeEach using the TestBed.inject
  // describe('getHero', () => {
  //   it('should call get with the correct URL', inject(
  //     [HeroService, HttpTestingController],
  //     (service: HeroService, controller: HttpTestingController) => {
  //       // call getHero
  //       service.getHero(4);

  //       // test that the URL was correct

  //     }
  //   ));
  // });
  describe('getHero', () => {
    it('should call get with the correct URL', () => {
      // call getHero
      service.getHero(4).subscribe();

      // service.getHero(4).subscribe((hero) => {
      //   expect(hero.id).toBe(4);
      // });
      // service.getHero(3).subscribe();

      // test that the URL was correct
      const req = httpTestingController.expectOne('api/heroes/4');

      req.flush({ id: 4, name: 'SuperDude', strength: 100 });
      expect(req.request.method).toBe('GET');
      httpTestingController.verify(); // ensure the http call is only called once and with the s
    });
  });
});
