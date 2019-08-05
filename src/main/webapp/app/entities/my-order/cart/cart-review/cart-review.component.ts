import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

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
        protected eventManager: JhiEventManager,
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

    save(goNext: boolean) {
        this.isSaving = true;
        this.myOrder.total = this.myOrderService.calculateTotalPrice(this.myOrder);
        this.subscribeToSaveResponse(
                this.myOrderService.update(this.myOrder), goNext);
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IMyOrder>>, goNext: boolean) {
        result.subscribe((res: HttpResponse<IMyOrder>) =>
            this.onSaveSuccess(res.body, goNext), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: IMyOrder, goNext: boolean) {
        this.myOrder = result;
        this.eventManager.broadcast({ name: 'myOrderModification', content: 'OK', obj: result});
        this.isSaving = false;
        if (goNext) {
            this.myOrderService.doCartNextAction(this.myOrder, this.path);
        }
    }

    private onSaveError() {
        this.isSaving = false;
    }

    canGoNext() {
        if (this.myOrder && this.myOrder.shops) {
            const total = this.myOrderService.calculateTotalQuantity(this.myOrder, false);
            if (total > 0) {
                // console.error('canGoNext: true');
                return true;
            } else {
                return false;
            }
        } else {
            // console.error('canGoNext: false');
            return false;
        }
    }
}
