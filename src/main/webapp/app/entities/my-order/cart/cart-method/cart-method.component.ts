import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IMyOrder } from 'app/shared/model/my-order.model';
import { MyOrderService } from 'app/entities/my-order';
import { IShippingType } from 'app/shared/model/shipping-type.model';
import { ShippingTypeService } from 'app/entities/shipping-type';

import { CartComponent } from 'app/entities/my-order/cart.component';

@Component({
    selector: 'jhi-shipping',
    templateUrl: './cart-method.component.html'
})
export class CartMethodComponent extends CartComponent implements OnInit {

    isSaving: boolean;
    shippingTypes: IShippingType[];

    constructor(
        private jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected myOrderService: MyOrderService,
        private shippingTypeService: ShippingTypeService,
        protected route: ActivatedRoute,
        protected router: Router
    ) { super(myOrderService, route, router); }

    ngOnInit() {
        super.ngOnInit();
        this.isSaving = false;
        this.shippingTypeService
            .query({filter: 'empty'})
            .subscribe((res: HttpResponse<IShippingType[]>) => {
                this.shippingTypes = res.body;
            }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    onSelectionChange(entry) {
        const shippingType: IShippingType = Object.assign({}, entry);
//        this.myOrder.shipping.type = shippingType;
//        this.myOrder.shipping.price = shippingType.price;
//        this.myOrder.shipping.currency = shippingType.currency;
    }

    save() {
        this.isSaving = true;
        this.myOrder.total = this.myOrderService.calculateTotalPrice(this.myOrder);
        this.subscribeToSaveResponse(
                this.myOrderService.update(this.myOrder));
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IMyOrder>>) {
        result.subscribe((res: HttpResponse<IMyOrder>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: IMyOrder) {
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

    canGoNext() {
        if (this.myOrder && this.myOrder.shops && this.myOrder.shops.length > 0 ) { // this.myOrder.shipping.type
            return true;
        } else {
            return false;
        }
    }
}
