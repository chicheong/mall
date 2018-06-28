import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { PaymentStatusHistory } from './payment-status-history.model';
import { PaymentStatusHistoryPopupService } from './payment-status-history-popup.service';
import { PaymentStatusHistoryService } from './payment-status-history.service';
import { Payment, PaymentService } from '../payment';

@Component({
    selector: 'jhi-payment-status-history-dialog',
    templateUrl: './payment-status-history-dialog.component.html'
})
export class PaymentStatusHistoryDialogComponent implements OnInit {

    paymentStatusHistory: PaymentStatusHistory;
    isSaving: boolean;

    payments: Payment[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private paymentStatusHistoryService: PaymentStatusHistoryService,
        private paymentService: PaymentService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.paymentService.query()
            .subscribe((res: HttpResponse<Payment[]>) => { this.payments = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.paymentStatusHistory.id !== undefined) {
            this.subscribeToSaveResponse(
                this.paymentStatusHistoryService.update(this.paymentStatusHistory));
        } else {
            this.subscribeToSaveResponse(
                this.paymentStatusHistoryService.create(this.paymentStatusHistory));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<PaymentStatusHistory>>) {
        result.subscribe((res: HttpResponse<PaymentStatusHistory>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: PaymentStatusHistory) {
        this.eventManager.broadcast({ name: 'paymentStatusHistoryListModification', content: 'OK'});
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
    selector: 'jhi-payment-status-history-popup',
    template: ''
})
export class PaymentStatusHistoryPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private paymentStatusHistoryPopupService: PaymentStatusHistoryPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.paymentStatusHistoryPopupService
                    .open(PaymentStatusHistoryDialogComponent as Component, params['id']);
            } else {
                this.paymentStatusHistoryPopupService
                    .open(PaymentStatusHistoryDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
