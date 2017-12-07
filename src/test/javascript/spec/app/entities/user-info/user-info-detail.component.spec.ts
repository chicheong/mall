/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { MallTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { UserInfoDetailComponent } from '../../../../../../main/webapp/app/entities/user-info/user-info-detail.component';
import { UserInfoService } from '../../../../../../main/webapp/app/entities/user-info/user-info.service';
import { UserInfo } from '../../../../../../main/webapp/app/entities/user-info/user-info.model';

describe('Component Tests', () => {

    describe('UserInfo Management Detail Component', () => {
        let comp: UserInfoDetailComponent;
        let fixture: ComponentFixture<UserInfoDetailComponent>;
        let service: UserInfoService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [UserInfoDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    UserInfoService,
                    JhiEventManager
                ]
            }).overrideTemplate(UserInfoDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(UserInfoDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(UserInfoService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new UserInfo(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.userInfo).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
