import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOrderShop } from 'app/shared/model/order-shop.model';

@Component({
    selector: 'jhi-order-shop-detail',
    templateUrl: './order-shop-detail.component.html'
})
export class OrderShopDetailComponent implements OnInit {
    orderShop: IOrderShop;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ orderShop }) => {
            this.orderShop = orderShop;
        });
    }

    previousState() {
        window.history.back();
    }
}
