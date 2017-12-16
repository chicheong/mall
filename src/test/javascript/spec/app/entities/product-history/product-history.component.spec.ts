/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { Headers } from '@angular/http';

import { MallTestModule } from '../../../test.module';
import { ProductHistoryComponent } from '../../../../../../main/webapp/app/entities/product-history/product-history.component';
import { ProductHistoryService } from '../../../../../../main/webapp/app/entities/product-history/product-history.service';
import { ProductHistory } from '../../../../../../main/webapp/app/entities/product-history/product-history.model';

describe('Component Tests', () => {

    describe('ProductHistory Management Component', () => {
        let comp: ProductHistoryComponent;
        let fixture: ComponentFixture<ProductHistoryComponent>;
        let service: ProductHistoryService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [ProductHistoryComponent],
                providers: [
                    ProductHistoryService
                ]
            })
            .overrideTemplate(ProductHistoryComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ProductHistoryComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ProductHistoryService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new Headers();
                headers.append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of({
                    json: [new ProductHistory(123)],
                    headers
                }));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.productHistories[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
