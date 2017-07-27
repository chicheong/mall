/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { MallTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { MyAccountDetailComponent } from '../../../../../../main/webapp/app/entities/my-account/my-account-detail.component';
import { MyAccountService } from '../../../../../../main/webapp/app/entities/my-account/my-account.service';
import { MyAccount } from '../../../../../../main/webapp/app/entities/my-account/my-account.model';

describe('Component Tests', () => {

    describe('MyAccount Management Detail Component', () => {
        let comp: MyAccountDetailComponent;
        let fixture: ComponentFixture<MyAccountDetailComponent>;
        let service: MyAccountService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [MyAccountDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    MyAccountService,
                    JhiEventManager
                ]
            }).overrideTemplate(MyAccountDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(MyAccountDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MyAccountService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new MyAccount(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.myAccount).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
