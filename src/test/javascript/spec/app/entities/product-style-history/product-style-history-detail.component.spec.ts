/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';

import { MallTestModule } from '../../../test.module';
import { ProductStyleHistoryDetailComponent } from '../../../../../../main/webapp/app/entities/product-style-history/product-style-history-detail.component';
import { ProductStyleHistoryService } from '../../../../../../main/webapp/app/entities/product-style-history/product-style-history.service';
import { ProductStyleHistory } from '../../../../../../main/webapp/app/entities/product-style-history/product-style-history.model';

describe('Component Tests', () => {

    describe('ProductStyleHistory Management Detail Component', () => {
        let comp: ProductStyleHistoryDetailComponent;
        let fixture: ComponentFixture<ProductStyleHistoryDetailComponent>;
        let service: ProductStyleHistoryService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [ProductStyleHistoryDetailComponent],
                providers: [
                    ProductStyleHistoryService
                ]
            })
            .overrideTemplate(ProductStyleHistoryDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ProductStyleHistoryDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ProductStyleHistoryService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new ProductStyleHistory(123)));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.productStyleHistory).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
