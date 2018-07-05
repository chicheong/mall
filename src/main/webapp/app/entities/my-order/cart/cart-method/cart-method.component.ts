import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

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
        private jhiAlertService: JhiAlertService,
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
            .query({filter: 'empty'})
            .subscribe((res: HttpResponse<ShippingType[]>) => {
                this.shippingTypes = res.body;
            }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    onSelectionChange(entry) {
        const shippingType: ShippingType = Object.assign({}, entry);
        this.myOrder.shipping.type = shippingType;
        this.myOrder.shipping.price = shippingType.price;
        this.myOrder.shipping.currency = shippingType.currency;
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

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    canGoNext() {
        if (this.myOrder && this.myOrder.items && this.myOrder.items.length > 0 && this.myOrder.shipping.type) {
            return true;
        } else {
            return false;
        }
    }
}
