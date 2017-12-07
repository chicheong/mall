/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { MallTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { ProductItemHistoryDetailComponent } from '../../../../../../main/webapp/app/entities/product-item-history/product-item-history-detail.component';
import { ProductItemHistoryService } from '../../../../../../main/webapp/app/entities/product-item-history/product-item-history.service';
import { ProductItemHistory } from '../../../../../../main/webapp/app/entities/product-item-history/product-item-history.model';

describe('Component Tests', () => {

    describe('ProductItemHistory Management Detail Component', () => {
        let comp: ProductItemHistoryDetailComponent;
        let fixture: ComponentFixture<ProductItemHistoryDetailComponent>;
        let service: ProductItemHistoryService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [ProductItemHistoryDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    ProductItemHistoryService,
                    JhiEventManager
                ]
            }).overrideTemplate(ProductItemHistoryDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ProductItemHistoryDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ProductItemHistoryService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new ProductItemHistory(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.productItemHistory).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
