/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { MallTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { StateDetailComponent } from '../../../../../../main/webapp/app/entities/state/state-detail.component';
import { StateService } from '../../../../../../main/webapp/app/entities/state/state.service';
import { State } from '../../../../../../main/webapp/app/entities/state/state.model';

describe('Component Tests', () => {

    describe('State Management Detail Component', () => {
        let comp: StateDetailComponent;
        let fixture: ComponentFixture<StateDetailComponent>;
        let service: StateService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [StateDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    StateService,
                    JhiEventManager
                ]
            }).overrideTemplate(StateDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(StateDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(StateService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new State(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.state).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
