import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

import { IMyOrder } from 'app/shared/model/my-order.model';
import { MyOrderService } from './my-order.service';

@Component({
    selector: 'jhi-my-order-detail',
    templateUrl: './my-order-detail.component.html'
})
export class MyOrderDetailComponent implements OnInit {
    myOrder: IMyOrder;
    isSaving: boolean;

    constructor(
        protected activatedRoute: ActivatedRoute,
        private myOrderService: MyOrderService,
        private router: Router
    ) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ myOrder }) => {
            this.myOrder = myOrder;
        });
    }

    updateMyOrder() {
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

    checkout() {
        console.log('calling checkout');
        this.save();
        this.router.navigate(['/checkout', this.myOrder.id]);
    }

    previousState() {
        this.save();
        window.history.back();
    }

    canCheckout() {
        if (this.myOrder && this.myOrder.shops && this.myOrder.shops.length > 0) {
            return true;
        } else {
            return false;
        }
    }
}
