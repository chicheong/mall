/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { MallTestModule } from '../../../test.module';
import { PaymentCreditCardDialogComponent } from '../../../../../../main/webapp/app/entities/payment-credit-card/payment-credit-card-dialog.component';
import { PaymentCreditCardService } from '../../../../../../main/webapp/app/entities/payment-credit-card/payment-credit-card.service';
import { PaymentCreditCard } from '../../../../../../main/webapp/app/entities/payment-credit-card/payment-credit-card.model';
import { PaymentService } from '../../../../../../main/webapp/app/entities/payment';

describe('Component Tests', () => {

    describe('PaymentCreditCard Management Dialog Component', () => {
        let comp: PaymentCreditCardDialogComponent;
        let fixture: ComponentFixture<PaymentCreditCardDialogComponent>;
        let service: PaymentCreditCardService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [PaymentCreditCardDialogComponent],
                providers: [
                    PaymentService,
                    PaymentCreditCardService
                ]
            })
            .overrideTemplate(PaymentCreditCardDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PaymentCreditCardDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PaymentCreditCardService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new PaymentCreditCard(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.paymentCreditCard = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'paymentCreditCardListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new PaymentCreditCard();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.paymentCreditCard = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'paymentCreditCardListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
