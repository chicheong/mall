/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { MallTestModule } from '../../../test.module';
import { ShippingPriceRuleComponent } from '../../../../../../main/webapp/app/entities/shipping-price-rule/shipping-price-rule.component';
import { ShippingPriceRuleService } from '../../../../../../main/webapp/app/entities/shipping-price-rule/shipping-price-rule.service';
import { ShippingPriceRule } from '../../../../../../main/webapp/app/entities/shipping-price-rule/shipping-price-rule.model';

describe('Component Tests', () => {

    describe('ShippingPriceRule Management Component', () => {
        let comp: ShippingPriceRuleComponent;
        let fixture: ComponentFixture<ShippingPriceRuleComponent>;
        let service: ShippingPriceRuleService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [ShippingPriceRuleComponent],
                providers: [
                    ShippingPriceRuleService
                ]
            })
            .overrideTemplate(ShippingPriceRuleComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ShippingPriceRuleComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ShippingPriceRuleService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new ShippingPriceRule(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.shippingPriceRules[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
