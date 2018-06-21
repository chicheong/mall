/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { MallTestModule } from '../../../test.module';
import { PaymentCreditCardDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/payment-credit-card/payment-credit-card-delete-dialog.component';
import { PaymentCreditCardService } from '../../../../../../main/webapp/app/entities/payment-credit-card/payment-credit-card.service';

describe('Component Tests', () => {

    describe('PaymentCreditCard Management Delete Component', () => {
        let comp: PaymentCreditCardDeleteDialogComponent;
        let fixture: ComponentFixture<PaymentCreditCardDeleteDialogComponent>;
        let service: PaymentCreditCardService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [PaymentCreditCardDeleteDialogComponent],
                providers: [
                    PaymentCreditCardService
                ]
            })
            .overrideTemplate(PaymentCreditCardDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PaymentCreditCardDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PaymentCreditCardService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        spyOn(service, 'delete').and.returnValue(Observable.of({}));

                        // WHEN
                        comp.confirmDelete(123);
                        tick();

                        // THEN
                        expect(service.delete).toHaveBeenCalledWith(123);
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
