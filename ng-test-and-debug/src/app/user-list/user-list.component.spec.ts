import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListComponent } from './user-list.component';
import { WebStorageService } from '../services/web-storage.service';
import { LocationIdPipe } from '../pipes/location-id.pipe';
import { CustomTestBed } from '../custom-test-bed';

describe('UserListComponent', () => {
    let component: UserListComponent;
    let fixture: ComponentFixture<UserListComponent>;

    beforeEach(async () => {
        // await TestBed.configureTestingModule({
        //     declarations: [ UserListComponent, LocationIdPipe ],
        //     providers: [
        //         { provide: WebStorageService, useValue: jasmine.createSpyObj('WebStorageService', [ 'getRemote', 'setRemote' ]) }
        //     ]
        // })
        await CustomTestBed.configureTestingModule({
            declarations: [UserListComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        // fixture = TestBed.createComponent(UserListComponent);
        fixture = CustomTestBed.createComponent(UserListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
