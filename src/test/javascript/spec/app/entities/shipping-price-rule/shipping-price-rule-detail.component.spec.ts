/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { MallTestModule } from '../../../test.module';
import { ShippingPriceRuleDetailComponent } from '../../../../../../main/webapp/app/entities/shipping-price-rule/shipping-price-rule-detail.component';
import { ShippingPriceRuleService } from '../../../../../../main/webapp/app/entities/shipping-price-rule/shipping-price-rule.service';
import { ShippingPriceRule } from '../../../../../../main/webapp/app/entities/shipping-price-rule/shipping-price-rule.model';

describe('Component Tests', () => {

    describe('ShippingPriceRule Management Detail Component', () => {
        let comp: ShippingPriceRuleDetailComponent;
        let fixture: ComponentFixture<ShippingPriceRuleDetailComponent>;
        let service: ShippingPriceRuleService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [ShippingPriceRuleDetailComponent],
                providers: [
                    ShippingPriceRuleService
                ]
            })
            .overrideTemplate(ShippingPriceRuleDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ShippingPriceRuleDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ShippingPriceRuleService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new ShippingPriceRule(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.shippingPriceRule).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
