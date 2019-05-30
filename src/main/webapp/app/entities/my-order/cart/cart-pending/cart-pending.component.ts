import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { IMyOrder } from 'app/shared/model/my-order.model';
import { MyOrderService } from 'app/entities/my-order';

import { IShipping } from 'app/shared/model/shipping.model';
import { ShippingStatus } from 'app/shared/model/shipping.model';
import { IAddress } from 'app/shared/model/address.model';
import { IPayment, Payment } from 'app/shared/model/payment.model';
import { PaymentStatus } from 'app/shared/model/payment.model';
import { IShippingType } from 'app/shared/model/shipping-type.model';

@Component({
    selector: 'jhi-pending-cart',
    templateUrl: './cart-pending.component.html'
})
export class CartPendingComponent implements OnInit, OnDestroy {

    myOrder: IMyOrder;
    subscription: Subscription;
    eventSubscriber: Subscription;
    isSaving: boolean;

    constructor(
        protected eventManager: JhiEventManager,
        protected myOrderService: MyOrderService,
        protected route: ActivatedRoute,
        protected router: Router
    ) {}

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
        this.registerChangeInMyOrders();
        this.isSaving = false;
    }

    load(id) {
        this.myOrderService.find(id)
            .subscribe((myOrderResponse: HttpResponse<IMyOrder>) => {
                this.myOrder = myOrderResponse.body;
                this.myOrder.shops.forEach(shop => {
//                   console.error('item.price: ' + item.price + ', item.quantity: ' + item.quantity);
                });
                // Initialize Shipping if not exist
                if (!this.myOrder) {
                    console.error('!this.myOrder');
                }
//                } else if (!this.myOrder.shipping) {
//                    const shipping: Shipping = Object.assign(new Shipping());
//                    shipping.status = ShippingStatus.PENDING;
//                    // shipping.currency = this.myOrder.currency;
//                    shipping.price = 0;
//                    const address: Address = Object.assign(new Address());
//                    shipping.shippingAddress = address;
//                    const shippingType: ShippingType = Object.assign(new ShippingType());
//                    shippingType.id = 1;
//                    shippingType.price = 0;
//                    shippingType.currency = this.myOrder.currency;
//                    shipping.type = shippingType;
//                    this.myOrder.shipping = shipping;
//                } else if (!this.myOrder.shipping.shippingAddress || !this.myOrder.shipping.type) {
//                    if (!this.myOrder.shipping.shippingAddress) {
//                        const address: Address = Object.assign(new Address());
//                        this.myOrder.shipping.shippingAddress = address;
//                    }
//                    if (!this.myOrder.shipping.type) {
//                        const shippingType: ShippingType = Object.assign(new ShippingType());
//                        shippingType.id = 1;
//                        shippingType.price = 0;
//                        shippingType.currency = this.myOrder.currency;
//                        this.myOrder.shipping.type = shippingType;
//                    }
//                }
                // Initialize Payment if not exist
                if (!this.myOrder) {
                    console.error('!this.myOrder');
                } else if (!this.myOrder.payment) {
                    const payment: IPayment = Object.assign(new Payment());
                    payment.status = PaymentStatus.PENDING;
                    this.myOrder.payment = payment;
                }
            });
    }

    sumAll(): number {
        return this.myOrderService.calculateTotalProductPrice(this.myOrder);
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
        }
    }

    private onSaveError() {
        this.isSaving = false;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInMyOrders() {
        this.eventSubscriber = this.eventManager.subscribe(
            'myOrderListModification',
            response => this.load(this.myOrder.id)
        );
    }

    canGoNext() {
        if (this.myOrder && this.myOrder.shops) {
            const total = this.myOrderService.calculateTotalQuantity(this.myOrder);
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

    previousState() {
        window.history.back();
    }
}
