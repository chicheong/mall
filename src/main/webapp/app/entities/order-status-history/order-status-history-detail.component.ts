import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOrderStatusHistory } from 'app/shared/model/order-status-history.model';

@Component({
    selector: 'jhi-order-status-history-detail',
    templateUrl: './order-status-history-detail.component.html'
})
export class OrderStatusHistoryDetailComponent implements OnInit {
    orderStatusHistory: IOrderStatusHistory;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ orderStatusHistory }) => {
            this.orderStatusHistory = orderStatusHistory;
        });
    }

    previousState() {
        window.history.back();
    }
}
