/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { MallTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { DelegationDetailComponent } from '../../../../../../main/webapp/app/entities/delegation/delegation-detail.component';
import { DelegationService } from '../../../../../../main/webapp/app/entities/delegation/delegation.service';
import { Delegation } from '../../../../../../main/webapp/app/entities/delegation/delegation.model';

describe('Component Tests', () => {

    describe('Delegation Management Detail Component', () => {
        let comp: DelegationDetailComponent;
        let fixture: ComponentFixture<DelegationDetailComponent>;
        let service: DelegationService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [DelegationDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    DelegationService,
                    JhiEventManager
                ]
            }).overrideTemplate(DelegationDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DelegationDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DelegationService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Delegation(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.delegation).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
