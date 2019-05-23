import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IPaymentStatusHistory } from 'app/shared/model/payment-status-history.model';
import { PaymentStatusHistoryService } from './payment-status-history.service';
import { IPayment } from 'app/shared/model/payment.model';
import { PaymentService } from 'app/entities/payment';

@Component({
    selector: 'jhi-payment-status-history-update',
    templateUrl: './payment-status-history-update.component.html'
})
export class PaymentStatusHistoryUpdateComponent implements OnInit {
    paymentStatusHistory: IPaymentStatusHistory;
    isSaving: boolean;

    payments: IPayment[];
    effectiveDate: string;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected paymentStatusHistoryService: PaymentStatusHistoryService,
        protected paymentService: PaymentService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ paymentStatusHistory }) => {
            this.paymentStatusHistory = paymentStatusHistory;
            this.effectiveDate =
                this.paymentStatusHistory.effectiveDate != null ? this.paymentStatusHistory.effectiveDate.format(DATE_TIME_FORMAT) : null;
        });
        this.paymentService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IPayment[]>) => mayBeOk.ok),
                map((response: HttpResponse<IPayment[]>) => response.body)
            )
            .subscribe((res: IPayment[]) => (this.payments = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.paymentStatusHistory.effectiveDate = this.effectiveDate != null ? moment(this.effectiveDate, DATE_TIME_FORMAT) : null;
        if (this.paymentStatusHistory.id !== undefined) {
            this.subscribeToSaveResponse(this.paymentStatusHistoryService.update(this.paymentStatusHistory));
        } else {
            this.subscribeToSaveResponse(this.paymentStatusHistoryService.create(this.paymentStatusHistory));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IPaymentStatusHistory>>) {
        result.subscribe(
            (res: HttpResponse<IPaymentStatusHistory>) => this.onSaveSuccess(),
            (res: HttpErrorResponse) => this.onSaveError()
        );
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackPaymentById(index: number, item: IPayment) {
        return item.id;
    }
}
