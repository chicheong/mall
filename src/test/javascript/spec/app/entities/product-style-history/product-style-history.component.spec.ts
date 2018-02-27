/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { MallTestModule } from '../../../test.module';
import { ProductStyleHistoryComponent } from '../../../../../../main/webapp/app/entities/product-style-history/product-style-history.component';
import { ProductStyleHistoryService } from '../../../../../../main/webapp/app/entities/product-style-history/product-style-history.service';
import { ProductStyleHistory } from '../../../../../../main/webapp/app/entities/product-style-history/product-style-history.model';

describe('Component Tests', () => {

    describe('ProductStyleHistory Management Component', () => {
        let comp: ProductStyleHistoryComponent;
        let fixture: ComponentFixture<ProductStyleHistoryComponent>;
        let service: ProductStyleHistoryService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [ProductStyleHistoryComponent],
                providers: [
                    ProductStyleHistoryService
                ]
            })
            .overrideTemplate(ProductStyleHistoryComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ProductStyleHistoryComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ProductStyleHistoryService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new ProductStyleHistory(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.productStyleHistories[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
