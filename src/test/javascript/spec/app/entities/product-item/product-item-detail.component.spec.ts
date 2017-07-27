/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { MallTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { ProductItemDetailComponent } from '../../../../../../main/webapp/app/entities/product-item/product-item-detail.component';
import { ProductItemService } from '../../../../../../main/webapp/app/entities/product-item/product-item.service';
import { ProductItem } from '../../../../../../main/webapp/app/entities/product-item/product-item.model';

describe('Component Tests', () => {

    describe('ProductItem Management Detail Component', () => {
        let comp: ProductItemDetailComponent;
        let fixture: ComponentFixture<ProductItemDetailComponent>;
        let service: ProductItemService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [ProductItemDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    ProductItemService,
                    JhiEventManager
                ]
            }).overrideTemplate(ProductItemDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ProductItemDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ProductItemService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new ProductItem(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.productItem).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
