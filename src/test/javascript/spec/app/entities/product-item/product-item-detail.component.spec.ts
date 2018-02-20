/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { MallTestModule } from '../../../test.module';
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
                    ProductItemService
                ]
            })
            .overrideTemplate(ProductItemDetailComponent, '')
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

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new ProductItem(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.productItem).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
