import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProductItemHistory } from 'app/shared/model/product-item-history.model';

@Component({
    selector: 'jhi-product-item-history-detail',
    templateUrl: './product-item-history-detail.component.html'
})
export class ProductItemHistoryDetailComponent implements OnInit {
    productItemHistory: IProductItemHistory;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ productItemHistory }) => {
            this.productItemHistory = productItemHistory;
        });
    }

    previousState() {
        window.history.back();
    }
}
