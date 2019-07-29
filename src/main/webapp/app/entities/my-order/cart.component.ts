import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

import { IMyOrder } from 'app/shared/model/my-order.model';
import { MyOrderService } from './my-order.service';

import { IShipping } from 'app/shared/model/shipping.model';
import { ShippingStatus } from 'app/shared/model/shipping.model';
import { IAddress } from 'app/shared/model/address.model';
import { IPayment, Payment } from 'app/shared/model/payment.model';
import { PaymentStatus } from 'app/shared/model/payment.model';
import { IShippingType } from 'app/shared/model/shipping-type.model';

import { CartControl } from './cart/cart-control/cart-control';

@Component({
    selector: 'jhi-cart',
    templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {

    myOrder: IMyOrder;
    cartControl: CartControl;
    path: String;

    constructor(
        protected myOrderService: MyOrderService,
        protected activatedRoute: ActivatedRoute,
        protected router: Router
    ) {
    }

    ngOnInit() {
        const urlSegment = this.activatedRoute.snapshot.url.pop();
        this.activatedRoute.snapshot.url.push(urlSegment);
        this.path = urlSegment.path;

        this.activatedRoute.data.subscribe(({ myOrder }) => {
            this.myOrder = myOrder;
            this.cartControl = this.myOrderService.getCartControl(this.myOrder, this.path);
        });
    }

    load(id) {
        this.myOrderService.find(id)
            .subscribe((myOrderResponse: HttpResponse<IMyOrder>) => {
                this.myOrder = myOrderResponse.body;
                this.myOrder.shops.forEach(shop => {
//                  console.error('item.price: ' + item.price + ', item.quantity: ' + item.quantity);
                });
                // Initialize Shipping if not exist
                if (!this.myOrder) {
                    console.error('!this.myOrder');
                } else if (!this.myOrder.shops) {
                    console.error('There is nothing in this order');
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
                // this.cartControl = this.myOrderService.getCartControl(this.myOrder, this.path);
            });
    }

    previousState() {
        this.myOrderService.doCartBackAction(this.myOrder, this.path);
    }
}
