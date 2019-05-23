/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { ProductItemDetailComponent } from 'app/entities/product-item/product-item-detail.component';
import { ProductItem } from 'app/shared/model/product-item.model';

describe('Component Tests', () => {
    describe('ProductItem Management Detail Component', () => {
        let comp: ProductItemDetailComponent;
        let fixture: ComponentFixture<ProductItemDetailComponent>;
        const route = ({ data: of({ productItem: new ProductItem(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [ProductItemDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(ProductItemDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ProductItemDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.productItem).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
