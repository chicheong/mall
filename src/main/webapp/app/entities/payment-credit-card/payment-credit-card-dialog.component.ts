import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { PaymentCreditCard } from './payment-credit-card.model';
import { PaymentCreditCardPopupService } from './payment-credit-card-popup.service';
import { PaymentCreditCardService } from './payment-credit-card.service';
import { Payment, PaymentService } from '../payment';

@Component({
    selector: 'jhi-payment-credit-card-dialog',
    templateUrl: './payment-credit-card-dialog.component.html'
})
export class PaymentCreditCardDialogComponent implements OnInit {

    paymentCreditCard: PaymentCreditCard;
    isSaving: boolean;

    payments: Payment[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private paymentCreditCardService: PaymentCreditCardService,
        private paymentService: PaymentService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.paymentService.query()
            .subscribe((res: HttpResponse<Payment[]>) => { this.payments = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        // this.paymentService
        //    .query({filter: 'paymentcreditcard-is-null'})
        //    .subscribe((res: HttpResponse<Payment[]>) => {
        //        if (!this.paymentCreditCard.payment || !this.paymentCreditCard.payment.id) {
        //            this.payments = res.body;
        //        } else {
        //            this.paymentService
        //                .find(this.paymentCreditCard.payment.id)
        //                .subscribe((subRes: HttpResponse<Payment>) => {
        //                    this.payments = [subRes.body].concat(res.body);
        //                }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
        //        }
        //    }, (res: HttpErrorResponse) => this.onError(res.message));*/            
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.paymentCreditCard.id !== undefined) {
            this.subscribeToSaveResponse(
                this.paymentCreditCardService.update(this.paymentCreditCard));
        } else {
            this.subscribeToSaveResponse(
                this.paymentCreditCardService.create(this.paymentCreditCard));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<PaymentCreditCard>>) {
        result.subscribe((res: HttpResponse<PaymentCreditCard>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: PaymentCreditCard) {
        this.eventManager.broadcast({ name: 'paymentCreditCardListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackPaymentById(index: number, item: Payment) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-payment-credit-card-popup',
    template: ''
})
export class PaymentCreditCardPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private paymentCreditCardPopupService: PaymentCreditCardPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.paymentCreditCardPopupService
                    .open(PaymentCreditCardDialogComponent as Component, params['id']);
            } else {
                this.paymentCreditCardPopupService
                    .open(PaymentCreditCardDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
