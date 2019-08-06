import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IMyOrder } from 'app/shared/model/my-order.model';
import { MyOrderService } from 'app/entities/my-order';
import { IOrderShop } from 'app/shared/model/order-shop.model';

import { CartComponent } from 'app/entities/my-order/cart.component';

@Component({
    selector: 'jhi-review-cart',
    templateUrl: './cart-review.component.html'
})
export class CartReviewComponent extends CartComponent implements OnInit {

    isSaving: boolean;

    constructor(
        protected myOrderService: MyOrderService,
        protected route: ActivatedRoute,
        protected router: Router
    ) { super(myOrderService, route, router); }

    ngOnInit() {
        super.ngOnInit();
        this.isSaving = false;
    }

    sumAll(): number {
        return this.myOrderService.calculateTotalPrice(this.myOrder);
    }

    sumShop(orderShop: IOrderShop): number {
        return this.myOrderService.calculateShopProductPrice(orderShop);
    }

    updateMyOrder() {
    }

    save() {
        this.isSaving = true;
        this.myOrder.total = this.myOrderService.calculateTotalPrice(this.myOrder);
        this.subscribeToSaveResponse(
                this.myOrderService.updateCheckout(this.myOrder));
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IMyOrder>>) {
        result.subscribe((res: HttpResponse<IMyOrder>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: IMyOrder) {
        this.myOrder = result;
        this.isSaving = false;
        this.myOrderService.doCartNextAction(this.myOrder, this.path);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    canGoNext() {
        if (this.myOrder && this.myOrder.shops) {
            const total = this.myOrderService.calculateTotalQuantity(this.myOrder, false);
            if (total > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}
