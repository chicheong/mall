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

    @Input() shipping: number;
    @Input() itemTotal: number;
    total: number;

    constructor(
        private myOrderService: MyOrderService
    ) {
    }

    ngOnInit() {
    }

    save() {}

    ngOnDestroy() {}
}
