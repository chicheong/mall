import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMyOrder } from 'app/shared/model/my-order.model';

@Component({
    selector: 'jhi-my-order-detail',
    templateUrl: './my-order-detail.component.html'
})
export class MyOrderDetailComponent implements OnInit {
    myOrder: IMyOrder;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ myOrder }) => {
            this.myOrder = myOrder;
        });
    }

    previousState() {
        window.history.back();
    }
}
