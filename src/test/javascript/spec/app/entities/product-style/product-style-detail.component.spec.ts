/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { ProductStyleDetailComponent } from 'app/entities/product-style/product-style-detail.component';
import { ProductStyle } from 'app/shared/model/product-style.model';

describe('Component Tests', () => {
    describe('ProductStyle Management Detail Component', () => {
        let comp: ProductStyleDetailComponent;
        let fixture: ComponentFixture<ProductStyleDetailComponent>;
        const route = ({ data: of({ productStyle: new ProductStyle(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [ProductStyleDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(ProductStyleDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ProductStyleDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.productStyle).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
