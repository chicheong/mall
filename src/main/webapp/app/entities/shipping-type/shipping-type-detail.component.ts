import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IShippingType } from 'app/shared/model/shipping-type.model';

@Component({
    selector: 'jhi-shipping-type-detail',
    templateUrl: './shipping-type-detail.component.html'
})
export class ShippingTypeDetailComponent implements OnInit {
    shippingType: IShippingType;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ shippingType }) => {
            this.shippingType = shippingType;
        });
    }

    previousState() {
        window.history.back();
    }
}
