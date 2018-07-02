import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { MyOrder } from './my-order.model';
import { MyOrderService } from './my-order.service';

import { Shipping } from './../shipping';
import { Address } from './../address';
import { Payment } from './../payment';

import { CartControl } from './cart/cart-control/cart-control';

@Component({
    selector: 'jhi-cart',
    templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit, OnDestroy {

    myOrder: MyOrder;
    cartControl: CartControl;
    path: String;
    subscription: Subscription;
    eventSubscriber: Subscription;

    constructor(
        protected eventManager: JhiEventManager,
        protected myOrderService: MyOrderService,
        protected route: ActivatedRoute,
        protected router: Router
    ) {
    }

    ngOnInit() {
        const urlSegment = this.route.snapshot.url.pop();
        this.route.snapshot.url.push(urlSegment);
        this.path = urlSegment.path;

        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInMyOrders();
    }

    load(id) {
        this.myOrderService.find(id)
            .subscribe((myOrderResponse: HttpResponse<MyOrder>) => {
                this.myOrder = myOrderResponse.body;
                this.myOrder.items.forEach((item) => {
                   console.error('item.price: ' + item.price + ', item.quantity: ' + item.quantity);
                });
                // Initialize Shipping if not exist
                if (!this.myOrder) {
                    console.error('!this.myOrder');
                } else if (!this.myOrder.shipping) {
                    console.error('!this.myOrder.shipping');
                    const shipping: Shipping = Object.assign(new Shipping());
                    // shipping.order = this.myOrder;
                    const address: Address = Object.assign(new Address());
                    shipping.shippingAddress = address;

                    this.myOrder.shipping = shipping;
                } else if (!this.myOrder.shipping.shippingAddress) {
                    console.error('!this.myOrder.shipping.shippingAddress');
                    const address: Address = Object.assign(new Address());
                    this.myOrder.shipping.shippingAddress = address;
                }
                // Initialize Payment if not exist
                if (!this.myOrder) {
                    console.error('!this.myOrder');
                } else if (!this.myOrder.payment) {
                    console.error('!this.myOrder.payment');
                    const payment: Payment = Object.assign(new Payment());
                    // payment.order = this.myOrder;
                    this.myOrder.payment = payment;
                }
                this.cartControl = this.myOrderService.getCartControl(this.myOrder, this.path);
            });
    }

    previousState() {
        // this.save(false);
        this.myOrderService.doCartBackAction(this.myOrder, this.path);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInMyOrders() {
        this.eventSubscriber = this.eventManager.subscribe(
            'myOrderListModification',
            (response) => this.load(this.myOrder.id)
        );
    }
}
