import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { MyOrder } from './../../my-order.model';
import { MyOrderService } from './../../my-order.service';

export const enum CheckoutControlType {
    HIDE = 'H',
    ACTIVE = 'A',
    DISABLED = 'D',
    COMPLETE = 'C',
}
@Component({
    selector: 'jhi-checkout-control',
    templateUrl: './checkout-control.component.html'
})
export class CheckoutControlComponent implements OnInit, OnDestroy {

    @Input() billingInfoControl = CheckoutControlType.HIDE;
    @Input() paymentControl = CheckoutControlType.HIDE;
    @Input() reviewCartControl = CheckoutControlType.HIDE;
    @Input() shippingControl = CheckoutControlType.HIDE;
    @Input() shippingInfoControl = CheckoutControlType.HIDE;
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
