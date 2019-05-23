/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { QuantityDetailComponent } from 'app/entities/quantity/quantity-detail.component';
import { Quantity } from 'app/shared/model/quantity.model';

describe('Component Tests', () => {
    describe('Quantity Management Detail Component', () => {
        let comp: QuantityDetailComponent;
        let fixture: ComponentFixture<QuantityDetailComponent>;
        const route = ({ data: of({ quantity: new Quantity(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [QuantityDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(QuantityDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(QuantityDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.quantity).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
