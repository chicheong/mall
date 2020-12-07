import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IShipping } from 'app/shared/model/shipping.model';

@Component({
  selector: 'jhi-shipping-detail',
  templateUrl: './shipping-detail.component.html'
})
export class ShippingDetailComponent implements OnInit {
  shipping: IShipping | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shipping }) => (this.shipping = shipping));
  }

  previousState(): void {
    window.history.back();
  }
}
