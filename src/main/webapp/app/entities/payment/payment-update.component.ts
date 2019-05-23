import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IPayment } from 'app/shared/model/payment.model';
import { PaymentService } from './payment.service';
import { IMyOrder } from 'app/shared/model/my-order.model';
import { MyOrderService } from 'app/entities/my-order';

@Component({
    selector: 'jhi-payment-update',
    templateUrl: './payment-update.component.html'
})
export class PaymentUpdateComponent implements OnInit {
    payment: IPayment;
    isSaving: boolean;

    myorders: IMyOrder[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected paymentService: PaymentService,
        protected myOrderService: MyOrderService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ payment }) => {
            this.payment = payment;
        });
        this.myOrderService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IMyOrder[]>) => mayBeOk.ok),
                map((response: HttpResponse<IMyOrder[]>) => response.body)
            )
            .subscribe((res: IMyOrder[]) => (this.myorders = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.payment.id !== undefined) {
            this.subscribeToSaveResponse(this.paymentService.update(this.payment));
        } else {
            this.subscribeToSaveResponse(this.paymentService.create(this.payment));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IPayment>>) {
        result.subscribe((res: HttpResponse<IPayment>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackMyOrderById(index: number, item: IMyOrder) {
        return item.id;
    }
}
