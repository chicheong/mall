/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { MallTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { ProductHistoryDetailComponent } from '../../../../../../main/webapp/app/entities/product-history/product-history-detail.component';
import { ProductHistoryService } from '../../../../../../main/webapp/app/entities/product-history/product-history.service';
import { ProductHistory } from '../../../../../../main/webapp/app/entities/product-history/product-history.model';

describe('Component Tests', () => {

    describe('ProductHistory Management Detail Component', () => {
        let comp: ProductHistoryDetailComponent;
        let fixture: ComponentFixture<ProductHistoryDetailComponent>;
        let service: ProductHistoryService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [ProductHistoryDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    ProductHistoryService,
                    JhiEventManager
                ]
            }).overrideTemplate(ProductHistoryDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ProductHistoryDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ProductHistoryService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new ProductHistory(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.productHistory).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
