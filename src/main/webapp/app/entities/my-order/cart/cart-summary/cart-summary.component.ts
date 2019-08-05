import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IMyOrder } from 'app/shared/model/my-order.model';
import { MyOrderService } from 'app/entities/my-order';

@Component({
    selector: 'jhi-checkout-summary',
    templateUrl: './cart-summary.component.html'
})
export class CartSummaryComponent implements OnInit, OnDestroy {

    @Input() myOrder: IMyOrder;
    @Input() total: number;

    constructor(
        private myOrderService: MyOrderService
    ) {
    }

    ngOnInit() {
    }

    ngOnDestroy() {}
}
