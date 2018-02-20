/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { MallTestModule } from '../../../test.module';
import { ProductItemComponent } from '../../../../../../main/webapp/app/entities/product-item/product-item.component';
import { ProductItemService } from '../../../../../../main/webapp/app/entities/product-item/product-item.service';
import { ProductItem } from '../../../../../../main/webapp/app/entities/product-item/product-item.model';

describe('Component Tests', () => {

    describe('ProductItem Management Component', () => {
        let comp: ProductItemComponent;
        let fixture: ComponentFixture<ProductItemComponent>;
        let service: ProductItemService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [ProductItemComponent],
                providers: [
                    ProductItemService
                ]
            })
            .overrideTemplate(ProductItemComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ProductItemComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ProductItemService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new ProductItem(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.productItems[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
