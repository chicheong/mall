/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { ShippingPriceRuleDetailComponent } from 'app/entities/shipping-price-rule/shipping-price-rule-detail.component';
import { ShippingPriceRule } from 'app/shared/model/shipping-price-rule.model';

describe('Component Tests', () => {
    describe('ShippingPriceRule Management Detail Component', () => {
        let comp: ShippingPriceRuleDetailComponent;
        let fixture: ComponentFixture<ShippingPriceRuleDetailComponent>;
        const route = ({ data: of({ shippingPriceRule: new ShippingPriceRule(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [ShippingPriceRuleDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(ShippingPriceRuleDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ShippingPriceRuleDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.shippingPriceRule).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
