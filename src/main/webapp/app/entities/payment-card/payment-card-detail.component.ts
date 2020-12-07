import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPaymentCard } from 'app/shared/model/payment-card.model';

@Component({
  selector: 'jhi-payment-card-detail',
  templateUrl: './payment-card-detail.component.html'
})
export class PaymentCardDetailComponent implements OnInit {
  paymentCard: IPaymentCard | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paymentCard }) => (this.paymentCard = paymentCard));
  }

  previousState(): void {
    window.history.back();
  }
}
