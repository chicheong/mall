import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPaymentStatusHistory } from 'app/shared/model/payment-status-history.model';

@Component({
  selector: 'jhi-payment-status-history-detail',
  templateUrl: './payment-status-history-detail.component.html'
})
export class PaymentStatusHistoryDetailComponent implements OnInit {
  paymentStatusHistory: IPaymentStatusHistory | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paymentStatusHistory }) => (this.paymentStatusHistory = paymentStatusHistory));
  }

  previousState(): void {
    window.history.back();
  }
}
