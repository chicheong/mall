import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { MyOrder } from '../my-order.model';
import { MyOrderService } from '../my-order.service';

@Component({
    selector: 'jhi-checkout-summary',
    templateUrl: './checkout-summary.component.html'
})
export class CheckoutSummaryComponent implements OnInit, OnDestroy {

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

    save() {}

    previousState() {
        this.save();
        window.history.back();
    }

    ngOnDestroy() {
        // this.subscription.unsubscribe();
        // this.eventManager.destroy(this.eventSubscriber);
    }
}
