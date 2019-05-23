/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { ProductStyleHistoryDetailComponent } from 'app/entities/product-style-history/product-style-history-detail.component';
import { ProductStyleHistory } from 'app/shared/model/product-style-history.model';

describe('Component Tests', () => {
    describe('ProductStyleHistory Management Detail Component', () => {
        let comp: ProductStyleHistoryDetailComponent;
        let fixture: ComponentFixture<ProductStyleHistoryDetailComponent>;
        const route = ({ data: of({ productStyleHistory: new ProductStyleHistory(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [ProductStyleHistoryDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(ProductStyleHistoryDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ProductStyleHistoryDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.productStyleHistory).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
