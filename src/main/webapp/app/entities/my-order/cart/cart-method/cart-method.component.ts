import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { MyOrder } from './../../my-order.model';
import { MyOrderService } from './../../my-order.service';
import { ShippingType, ShippingTypeService } from './../../../shipping-type';

import { CartComponent } from './../../cart.component';

@Component({
    selector: 'jhi-shipping',
    templateUrl: './cart-method.component.html'
})
export class CartMethodComponent extends CartComponent implements OnInit, OnDestroy {

    isSaving: boolean;
    shippingTypes: ShippingType[];

    constructor(
        protected eventManager: JhiEventManager,
        protected myOrderService: MyOrderService,
        private shippingTypeService: ShippingTypeService,
        protected route: ActivatedRoute,
        protected router: Router
    ) { super(eventManager, myOrderService, route, router); }

    ngOnInit() {
        super.ngOnInit();
        this.isSaving = false;
        this.shippingTypeService
            .query({filter: 'payment-is-null'})
            .subscribe((res: HttpResponse<ShippingType[]>) => {
                this.shippingTypes = res.body;
            }, (res: HttpErrorResponse) => this.onSaveError());
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
        this.eventManager.broadcast({ name: 'myOrderModification', content: 'OK', obj: result});
        this.isSaving = false;
        this.myOrderService.doCartNextAction(this.myOrder, this.path);
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
        if (this.myOrder && this.myOrder.items && this.myOrder.items.length > 0) {
            return true;
        } else {
            return false;
        }
    }
}
