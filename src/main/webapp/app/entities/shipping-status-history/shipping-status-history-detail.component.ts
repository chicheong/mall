import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IShippingStatusHistory } from 'app/shared/model/shipping-status-history.model';

@Component({
    selector: 'jhi-shipping-status-history-detail',
    templateUrl: './shipping-status-history-detail.component.html'
})
export class ShippingStatusHistoryDetailComponent implements OnInit {
    shippingStatusHistory: IShippingStatusHistory;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ shippingStatusHistory }) => {
            this.shippingStatusHistory = shippingStatusHistory;
        });
    }

    previousState() {
        window.history.back();
    }
}
