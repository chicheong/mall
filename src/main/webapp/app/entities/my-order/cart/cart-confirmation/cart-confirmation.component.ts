import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { MyOrder } from './../../my-order.model';
import { MyOrderService } from './../../my-order.service';
import { PaymentCard } from './../../../payment-card';
import { Payment, PaymentType, PaymentStatus } from './../../../payment';

@Component({
    selector: 'jhi-confirmation',
    templateUrl: './cart-confirmation.component.html'
})
export class CartConfirmationComponent implements OnInit, OnDestroy {

    myOrder: MyOrder;
    isSaving: boolean;
    subscription: Subscription;

    constructor(
        private myOrderService: MyOrderService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
    }

    load(id) {
        this.myOrderService.find(id)
            .subscribe((myOrderResponse: HttpResponse<MyOrder>) => {
                this.myOrder = myOrderResponse.body;
            });
    }

    save() {
        this.isSaving = true;
        this.subscribeToSaveResponse(
                this.myOrderService.update(this.myOrder));
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<MyOrder>>) {
        result.subscribe((res: HttpResponse<MyOrder>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: MyOrder) {
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
