/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { ProductHistoryDetailComponent } from 'app/entities/product-history/product-history-detail.component';
import { ProductHistory } from 'app/shared/model/product-history.model';

describe('Component Tests', () => {
    describe('ProductHistory Management Detail Component', () => {
        let comp: ProductHistoryDetailComponent;
        let fixture: ComponentFixture<ProductHistoryDetailComponent>;
        const route = ({ data: of({ productHistory: new ProductHistory(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [ProductHistoryDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(ProductHistoryDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ProductHistoryDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.productHistory).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
