/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';

import { MallTestModule } from '../../../test.module';
import { ProductStyleDetailComponent } from '../../../../../../main/webapp/app/entities/product-style/product-style-detail.component';
import { ProductStyleService } from '../../../../../../main/webapp/app/entities/product-style/product-style.service';
import { ProductStyle } from '../../../../../../main/webapp/app/entities/product-style/product-style.model';

describe('Component Tests', () => {

    describe('ProductStyle Management Detail Component', () => {
        let comp: ProductStyleDetailComponent;
        let fixture: ComponentFixture<ProductStyleDetailComponent>;
        let service: ProductStyleService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [ProductStyleDetailComponent],
                providers: [
                    ProductStyleService
                ]
            })
            .overrideTemplate(ProductStyleDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ProductStyleDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ProductStyleService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new ProductStyle(123)));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.productStyle).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
