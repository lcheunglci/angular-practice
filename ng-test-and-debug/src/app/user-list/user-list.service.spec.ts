import { TestBed } from '@angular/core/testing';
import { UserListService } from './user-list.service';
import { HttpClient } from '@angular/common/http';

describe('User List Service', () => {
    let service: UserListService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {provide: HttpClient, useValue: jasmine.createSpyObj('HttpClient', ['get', 'put'])}
            ]
        })

        service = new UserListService();
    });

    it('should return a User List with 16 users', (done: DoneFn) => {
        service.getAll().then((response) => {
            expect(response.length).toBe(16);
            done();
        });
    });
});