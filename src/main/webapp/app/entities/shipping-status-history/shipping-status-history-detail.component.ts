import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IShippingStatusHistory } from 'app/shared/model/shipping-status-history.model';

@Component({
  selector: 'jhi-shipping-status-history-detail',
  templateUrl: './shipping-status-history-detail.component.html'
})
export class ShippingStatusHistoryDetailComponent implements OnInit {
  shippingStatusHistory: IShippingStatusHistory | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shippingStatusHistory }) => (this.shippingStatusHistory = shippingStatusHistory));
  }

  previousState(): void {
    window.history.back();
  }
}
