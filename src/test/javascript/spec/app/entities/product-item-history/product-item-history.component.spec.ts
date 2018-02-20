/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { MallTestModule } from '../../../test.module';
import { ProductItemHistoryComponent } from '../../../../../../main/webapp/app/entities/product-item-history/product-item-history.component';
import { ProductItemHistoryService } from '../../../../../../main/webapp/app/entities/product-item-history/product-item-history.service';
import { ProductItemHistory } from '../../../../../../main/webapp/app/entities/product-item-history/product-item-history.model';

describe('Component Tests', () => {

    describe('ProductItemHistory Management Component', () => {
        let comp: ProductItemHistoryComponent;
        let fixture: ComponentFixture<ProductItemHistoryComponent>;
        let service: ProductItemHistoryService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [ProductItemHistoryComponent],
                providers: [
                    ProductItemHistoryService
                ]
            })
            .overrideTemplate(ProductItemHistoryComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ProductItemHistoryComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ProductItemHistoryService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new ProductItemHistory(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.productItemHistories[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
