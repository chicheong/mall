import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IShippingPriceRule } from 'app/shared/model/shipping-price-rule.model';

@Component({
  selector: 'jhi-shipping-price-rule-detail',
  templateUrl: './shipping-price-rule-detail.component.html'
})
export class ShippingPriceRuleDetailComponent implements OnInit {
  shippingPriceRule: IShippingPriceRule | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shippingPriceRule }) => (this.shippingPriceRule = shippingPriceRule));
  }

  previousState(): void {
    window.history.back();
  }
}
