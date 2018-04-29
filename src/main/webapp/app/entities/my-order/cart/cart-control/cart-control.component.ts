import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { MyOrder } from './../../my-order.model';
import { MyOrderService } from './../../my-order.service';

import { CartControl } from './cart-control';
import { CartControlType } from './cart-control-type';

export const enum CheckoutControlType {
    HIDE = 'H',
    ACTIVE = 'A',
    DISABLED = 'D',
    COMPLETE = 'C',
}
@Component({
    selector: 'jhi-checkout-control',
    templateUrl: './cart-control.component.html'
})
export class CartControlComponent implements OnInit, OnDestroy {

    @Input() cartControl: CartControl;
    @Input() billingInfoControl = CartControlType.HIDE;
    @Input() paymentControl = CartControlType.HIDE;
    @Input() reviewCartControl = CartControlType.HIDE;
    @Input() shippingControl = CartControlType.HIDE;
    @Input() shippingInfoControl = CartControlType.HIDE;
    myOrder: MyOrder;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private myOrderService: MyOrderService,
        private route: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit() {
    }

    goToReviewCart() {
        console.error(this.route.snapshot.url.pop().path);
    }

    goToShippingInfo() {
    }

    goToShipping() {
    }

    goToBillingInfo() {
    }

    goToPayment() {
    }

    ngOnDestroy() {
        // this.subscription.unsubscribe();
        // this.eventManager.destroy(this.eventSubscriber);
    }
}
