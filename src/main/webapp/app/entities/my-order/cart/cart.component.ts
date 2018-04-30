import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { MyOrder } from './../../my-order.model';
import { MyOrderService } from './../../my-order.service';

import { CartControl } from './../cart-control/cart-control';

@Component({
    selector: 'jhi-cart',
    templateUrl: ''
})
export class CartComponent implements OnInit, OnDestroy {

    myOrder: MyOrder;
    cartControl: CartControl;
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
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.cartControl = this.myOrderService.getCartControl(this.myOrder, this.route.snapshot.url.pop().path);
    }

    load(id) {
        this.myOrderService.find(id)
            .subscribe((myOrderResponse: HttpResponse<MyOrder>) => {
                this.myOrder = myOrderResponse.body;
                this.myOrder.items.forEach((item) => {
                   console.error('item.price: ' + item.price + ', item.quantity: ' + item.quantity);
                });
            });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }
}
