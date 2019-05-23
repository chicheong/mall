import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IShipping } from 'app/shared/model/shipping.model';

@Component({
    selector: 'jhi-shipping-detail',
    templateUrl: './shipping-detail.component.html'
})
export class ShippingDetailComponent implements OnInit {
    shipping: IShipping;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ shipping }) => {
            this.shipping = shipping;
        });
    }

    previousState() {
        window.history.back();
    }
}
