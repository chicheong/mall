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
    shipping = 1000;
    itemTotal: number;
    total: number;

    constructor(
        private myOrderService: MyOrderService
    ) {
    }

    ngOnInit() {
        this.itemTotal = this.myOrderService.sumAllItems(this.myOrder);
        this.total = this.shipping + this.itemTotal;
        console.error('total: ' + this.total);
    }

    save() {}

    ngOnDestroy() {}
}
