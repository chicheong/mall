/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';

import { MallTestModule } from '../../../test.module';
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
                    ProductItemHistoryService
                ]
            })
            .overrideTemplate(ProductItemHistoryDetailComponent, '')
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

                spyOn(service, 'find').and.returnValue(Observable.of(new ProductItemHistory(123)));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.productItemHistory).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
