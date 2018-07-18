import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { PaymentCard } from './payment-card.model';
import { PaymentCardPopupService } from './payment-card-popup.service';
import { PaymentCardService } from './payment-card.service';
import { Payment, PaymentService } from '../payment';

@Component({
    selector: 'jhi-payment-card-dialog',
    templateUrl: './payment-card-dialog.component.html'
})
export class PaymentCardDialogComponent implements OnInit {

    paymentCard: PaymentCard;
    isSaving: boolean;

    payments: Payment[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private paymentCardService: PaymentCardService,
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
        if (this.paymentCard.id !== undefined) {
            this.subscribeToSaveResponse(
                this.paymentCardService.update(this.paymentCard));
        } else {
            this.subscribeToSaveResponse(
                this.paymentCardService.create(this.paymentCard));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<PaymentCard>>) {
        result.subscribe((res: HttpResponse<PaymentCard>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: PaymentCard) {
        this.eventManager.broadcast({ name: 'paymentCardListModification', content: 'OK'});
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
    selector: 'jhi-payment-card-popup',
    template: ''
})
export class PaymentCardPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private paymentCardPopupService: PaymentCardPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.paymentCardPopupService
                    .open(PaymentCardDialogComponent as Component, params['id']);
            } else {
                this.paymentCardPopupService
                    .open(PaymentCardDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
