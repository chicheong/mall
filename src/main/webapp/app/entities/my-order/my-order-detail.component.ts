import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { MyOrder } from './my-order.model';
import { MyOrderService } from './my-order.service';

@Component({
    selector: 'jhi-my-order-detail',
    templateUrl: './my-order-detail.component.html'
})
export class MyOrderDetailComponent implements OnInit, OnDestroy {

    myOrder: MyOrder;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private myOrderService: MyOrderService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInMyOrders();
    }

    load(id) {
        this.myOrderService.find(id).subscribe((myOrder) => {
            this.myOrder = myOrder;
        });
    }
    previousState() {
        window.history.back();
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
