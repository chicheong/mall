import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProductStyle } from 'app/shared/model/product-style.model';

@Component({
    selector: 'jhi-product-style-detail',
    templateUrl: './product-style-detail.component.html'
})
export class ProductStyleDetailComponent implements OnInit {
    productStyle: IProductStyle;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ productStyle }) => {
            this.productStyle = productStyle;
        });
    }

    previousState() {
        window.history.back();
    }
}
