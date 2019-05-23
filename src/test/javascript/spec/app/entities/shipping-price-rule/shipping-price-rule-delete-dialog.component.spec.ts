/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { MallTestModule } from '../../../test.module';
import { ShippingPriceRuleDeleteDialogComponent } from 'app/entities/shipping-price-rule/shipping-price-rule-delete-dialog.component';
import { ShippingPriceRuleService } from 'app/entities/shipping-price-rule/shipping-price-rule.service';

describe('Component Tests', () => {
    describe('ShippingPriceRule Management Delete Component', () => {
        let comp: ShippingPriceRuleDeleteDialogComponent;
        let fixture: ComponentFixture<ShippingPriceRuleDeleteDialogComponent>;
        let service: ShippingPriceRuleService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [ShippingPriceRuleDeleteDialogComponent]
            })
                .overrideTemplate(ShippingPriceRuleDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ShippingPriceRuleDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ShippingPriceRuleService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
