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
    @Input() myOrderId: number;
    path: String;
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
        const urlSegment = this.route.snapshot.url.pop();
        this.route.snapshot.url.push(urlSegment);
        this.path = urlSegment.path;
    }

    goToReview() {
        console.error('this.path: ' + this.path);
        if (!(this.path === 'review')) {
            this.router.navigate(['/my-order/' + this.myOrderId + '/review']);
        }
    }

    goToShipping() {
        console.error('this.path: ' + this.path);
        if (!(this.path === 'shipping')) {
            this.router.navigate(['/my-order/' + this.myOrderId + '/shipping']);
        }
    }

    goToMethod() {
        console.error('this.path: ' + this.path);
        if (!(this.path === 'method')) {
            this.router.navigate(['/my-order/' + this.myOrderId + '/method']);
        }
    }

    goToBilling() {
        console.error('this.path: ' + this.path);
        if (!(this.path === 'billing')) {
            this.router.navigate(['/my-order/' + this.myOrderId + '/billing']);
        }
    }

    goToPayment() {
        console.error('this.path: ' + this.path);
        if (!(this.path === 'payment')) {
            this.router.navigate(['/my-order/' + this.myOrderId + '/payment']);
        }
    }

    ngOnDestroy() {
        // this.subscription.unsubscribe();
        // this.eventManager.destroy(this.eventSubscriber);
    }
}
