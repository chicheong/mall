import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IPaymentCard } from 'app/shared/model/payment-card.model';
import { PaymentCardService } from './payment-card.service';
import { IPayment } from 'app/shared/model/payment.model';
import { PaymentService } from 'app/entities/payment';

@Component({
    selector: 'jhi-payment-card-update',
    templateUrl: './payment-card-update.component.html'
})
export class PaymentCardUpdateComponent implements OnInit {
    paymentCard: IPaymentCard;
    isSaving: boolean;

    payments: IPayment[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected paymentCardService: PaymentCardService,
        protected paymentService: PaymentService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ paymentCard }) => {
            this.paymentCard = paymentCard;
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
        if (this.paymentCard.id !== undefined) {
            this.subscribeToSaveResponse(this.paymentCardService.update(this.paymentCard));
        } else {
            this.subscribeToSaveResponse(this.paymentCardService.create(this.paymentCard));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IPaymentCard>>) {
        result.subscribe((res: HttpResponse<IPaymentCard>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
