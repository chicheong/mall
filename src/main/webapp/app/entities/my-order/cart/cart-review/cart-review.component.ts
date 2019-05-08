import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { MyOrder } from './../../my-order.model';
import { MyOrderService } from './../../my-order.service';

import { CartComponent } from './../../cart.component';

@Component({
    selector: 'jhi-review-cart',
    templateUrl: './cart-review.component.html'
})
export class CartReviewComponent extends CartComponent implements OnInit, OnDestroy {

    isSaving: boolean;

    constructor(
        protected eventManager: JhiEventManager,
        protected myOrderService: MyOrderService,
        protected route: ActivatedRoute,
        protected router: Router
    ) { super(eventManager, myOrderService, route, router); }

    ngOnInit() {
        super.ngOnInit();
        this.isSaving = false;
    }

    sumAll(): number {
        return this.myOrderService.getTotalProductPrice(this.myOrder);
    }

    updateMyOrder() {
    }

    save(goNext: boolean) {
        this.isSaving = true;
        this.myOrder.total = this.myOrderService.getTotalPrice(this.myOrder);
        this.subscribeToSaveResponse(
                this.myOrderService.update(this.myOrder), goNext);
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<MyOrder>>, goNext: boolean) {
        result.subscribe((res: HttpResponse<MyOrder>) =>
            this.onSaveSuccess(res.body, goNext), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: MyOrder, goNext: boolean) {
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

    ngOnDestroy() {
        super.ngOnDestroy();
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    canGoNext() {
        if (this.myOrder && this.myOrder.shops) {
            let total = this.myOrderService.getTotalQuantity(this.myOrder);
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
