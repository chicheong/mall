import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

import { IMyOrder } from 'app/shared/model/my-order.model';
import { MyOrderService } from 'app/entities/my-order';
import { IPaymentCard } from 'app/shared/model/payment-card.model';
import { IPayment, PaymentType } from 'app/shared/model/payment.model';
import { PaymentStatus } from 'app/shared/model/payment.model';

@Component({
    selector: 'jhi-confirmation',
    templateUrl: './cart-confirmation.component.html'
})
export class CartConfirmationComponent implements OnInit, OnDestroy {

    myOrder: IMyOrder;
    isSaving: boolean;
    subscription: Subscription;

    constructor(
        private myOrderService: MyOrderService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load(id) {
        this.myOrderService.find(id)
            .subscribe((myOrderResponse: HttpResponse<IMyOrder>) => {
                this.myOrder = myOrderResponse.body;
            });
    }

    save() {
        this.isSaving = true;
        this.subscribeToSaveResponse(
                this.myOrderService.update(this.myOrder));
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IMyOrder>>) {
        result.subscribe((res: HttpResponse<IMyOrder>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: IMyOrder) {
        this.myOrder = result;
        this.isSaving = false;
    }

    private onSaveError() {
        this.isSaving = false;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
