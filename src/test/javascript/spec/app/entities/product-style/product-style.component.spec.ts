/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { Headers } from '@angular/http';

import { MallTestModule } from '../../../test.module';
import { ProductStyleComponent } from '../../../../../../main/webapp/app/entities/product-style/product-style.component';
import { ProductStyleService } from '../../../../../../main/webapp/app/entities/product-style/product-style.service';
import { ProductStyle } from '../../../../../../main/webapp/app/entities/product-style/product-style.model';

describe('Component Tests', () => {

    describe('ProductStyle Management Component', () => {
        let comp: ProductStyleComponent;
        let fixture: ComponentFixture<ProductStyleComponent>;
        let service: ProductStyleService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [ProductStyleComponent],
                providers: [
                    ProductStyleService
                ]
            })
            .overrideTemplate(ProductStyleComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ProductStyleComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ProductStyleService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new Headers();
                headers.append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of({
                    json: [new ProductStyle(123)],
                    headers
                }));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.productStyles[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
