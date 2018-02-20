/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { MallTestModule } from '../../../test.module';
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
                    ProductHistoryService
                ]
            })
            .overrideTemplate(ProductHistoryDetailComponent, '')
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

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new ProductHistory(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.productHistory).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
