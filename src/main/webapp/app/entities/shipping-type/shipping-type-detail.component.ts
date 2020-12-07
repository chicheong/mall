import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IShippingType } from 'app/shared/model/shipping-type.model';

@Component({
  selector: 'jhi-shipping-type-detail',
  templateUrl: './shipping-type-detail.component.html'
})
export class ShippingTypeDetailComponent implements OnInit {
  shippingType: IShippingType | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shippingType }) => (this.shippingType = shippingType));
  }

  previousState(): void {
    window.history.back();
  }
}
