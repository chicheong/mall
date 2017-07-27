/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { MallTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { PriceDetailComponent } from '../../../../../../main/webapp/app/entities/price/price-detail.component';
import { PriceService } from '../../../../../../main/webapp/app/entities/price/price.service';
import { Price } from '../../../../../../main/webapp/app/entities/price/price.model';

describe('Component Tests', () => {

    describe('Price Management Detail Component', () => {
        let comp: PriceDetailComponent;
        let fixture: ComponentFixture<PriceDetailComponent>;
        let service: PriceService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [PriceDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    PriceService,
                    JhiEventManager
                ]
            }).overrideTemplate(PriceDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PriceDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PriceService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Price(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.price).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
