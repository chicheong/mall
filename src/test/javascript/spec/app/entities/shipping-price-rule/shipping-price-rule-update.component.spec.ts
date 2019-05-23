/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { ShippingPriceRuleUpdateComponent } from 'app/entities/shipping-price-rule/shipping-price-rule-update.component';
import { ShippingPriceRuleService } from 'app/entities/shipping-price-rule/shipping-price-rule.service';
import { ShippingPriceRule } from 'app/shared/model/shipping-price-rule.model';

describe('Component Tests', () => {
    describe('ShippingPriceRule Management Update Component', () => {
        let comp: ShippingPriceRuleUpdateComponent;
        let fixture: ComponentFixture<ShippingPriceRuleUpdateComponent>;
        let service: ShippingPriceRuleService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [ShippingPriceRuleUpdateComponent]
            })
                .overrideTemplate(ShippingPriceRuleUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ShippingPriceRuleUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ShippingPriceRuleService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new ShippingPriceRule(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.shippingPriceRule = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'Should call create service on save for new entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new ShippingPriceRule();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.shippingPriceRule = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );
        });
    });
});
