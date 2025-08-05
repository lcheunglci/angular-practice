import { TestBed } from '@angular/core/testing';
import { UserListService } from './user-list.service';
import { WebStorageService } from '../services/web-storage.service';

describe('User List Service', () => {
    let service: UserListService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: WebStorageService,
                    useValue: jasmine.createSpyObj('WebStorageService', [
                        'getRemote',
                        'setRemote',
                    ]),
                },
            ],
        });

        service = new UserListService();
    });

    it('should return a User List with 16 users', (done: DoneFn) => {
        service.getAll().then((response) => {
            expect(response.length).toBe(16);
            done();
        });
    });
});
