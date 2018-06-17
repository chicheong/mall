import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { MyOrder } from './../../my-order.model';
import { MyOrderService } from './../../my-order.service';

@Component({
    selector: 'jhi-checkout-summary',
    templateUrl: './cart-summary.component.html'
})
export class CartSummaryComponent implements OnInit, OnDestroy {

    @Input() myOrder: MyOrder;
    @Input() shipping: number;
    @Input() itemTotal: number;

    constructor(
        private myOrderService: MyOrderService
    ) {
    }

    ngOnInit() {
        if (this.itemTotal === undefined) {
            if (this.myOrder && this.myOrder.items) {
                this.itemTotal = this.myOrderService.sumAll(this.myOrder);
            } else {
                this.itemTotal = 0;
            }
        }
        if (this.shipping === undefined) {
            this.shipping = 0;
        }
    }

    sum(): number {
        return this.shipping + this.itemTotal;
    }

    save() {}

    ngOnDestroy() {}
}
