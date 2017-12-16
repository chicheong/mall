/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { Headers } from '@angular/http';

import { MallTestModule } from '../../../test.module';
import { UserInfoComponent } from '../../../../../../main/webapp/app/entities/user-info/user-info.component';
import { UserInfoService } from '../../../../../../main/webapp/app/entities/user-info/user-info.service';
import { UserInfo } from '../../../../../../main/webapp/app/entities/user-info/user-info.model';

describe('Component Tests', () => {

    describe('UserInfo Management Component', () => {
        let comp: UserInfoComponent;
        let fixture: ComponentFixture<UserInfoComponent>;
        let service: UserInfoService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [UserInfoComponent],
                providers: [
                    UserInfoService
                ]
            })
            .overrideTemplate(UserInfoComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(UserInfoComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(UserInfoService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new Headers();
                headers.append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of({
                    json: [new UserInfo(123)],
                    headers
                }));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.userInfos[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
