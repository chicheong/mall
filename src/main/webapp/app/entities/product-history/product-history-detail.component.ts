import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProductHistory } from 'app/shared/model/product-history.model';

@Component({
    selector: 'jhi-product-history-detail',
    templateUrl: './product-history-detail.component.html'
})
export class ProductHistoryDetailComponent implements OnInit {
    productHistory: IProductHistory;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ productHistory }) => {
            this.productHistory = productHistory;
        });
    }

    previousState() {
        window.history.back();
    }
}
