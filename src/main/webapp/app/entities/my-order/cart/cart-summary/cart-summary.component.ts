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
    @Input() shipping: number;
    @Input() itemTotal: number;

    constructor(
        private myOrderService: MyOrderService
    ) {
    }

    ngOnInit() {
        if (this.itemTotal === undefined || !this.itemTotal) {
//            if (this.myOrder && this.myOrder.items) {
//                this.itemTotal = this.myOrderService.sumAll(this.myOrder);
//            } else {
//                this.itemTotal = 0;
//            }
        }
        if (this.shipping === undefined || !this.shipping) {
//            if (this.myOrder && this.myOrder.shipping) {
//                this.shipping = this.myOrder.shipping.price ? this.myOrder.shipping.price : 0;
//            } else {
//                this.shipping = 0;
//            }
        }
    }

    sum(): number {
        return this.shipping + this.itemTotal;
    }

    save() {}

    ngOnDestroy() {}
}
