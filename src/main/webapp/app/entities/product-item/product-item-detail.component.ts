import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProductItem } from 'app/shared/model/product-item.model';

@Component({
    selector: 'jhi-product-item-detail',
    templateUrl: './product-item-detail.component.html'
})
export class ProductItemDetailComponent implements OnInit {
    productItem: IProductItem;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ productItem }) => {
            this.productItem = productItem;
        });
    }

    previousState() {
        window.history.back();
    }
}
