import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProductStyleHistory } from 'app/shared/model/product-style-history.model';

@Component({
    selector: 'jhi-product-style-history-detail',
    templateUrl: './product-style-history-detail.component.html'
})
export class ProductStyleHistoryDetailComponent implements OnInit {
    productStyleHistory: IProductStyleHistory;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ productStyleHistory }) => {
            this.productStyleHistory = productStyleHistory;
        });
    }

    previousState() {
        window.history.back();
    }
}
