import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { IMyOrder } from 'app/shared/model/my-order.model';
import { MyOrderService } from 'app/entities/my-order';

import { CartControl } from './cart-control';
import { CartControlType } from './cart-control-type';

@Component({
    selector: 'jhi-checkout-control',
    templateUrl: './cart-control.component.html'
})
export class CartControlComponent implements OnInit, OnDestroy {

    @Input() cartControl: CartControl;
    @Input() myOrderId: number;
    @Input() path: String;
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
        // const urlSegment = this.route.snapshot.url.pop();
        // this.route.snapshot.url.push(urlSegment);
        // this.path = urlSegment.path;
    }

    goTo(pathName: String) {
        console.error('this.path: ' + this.path);
        if (!(this.path === pathName)) {
            this.router.navigate(['/my-order/' + this.myOrderId + '/' + pathName]);
        }
    }

    ngOnDestroy() {
        // this.subscription.unsubscribe();
        // this.eventManager.destroy(this.eventSubscriber);
    }
}
