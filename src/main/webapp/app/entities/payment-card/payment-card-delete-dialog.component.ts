import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPaymentCard } from 'app/shared/model/payment-card.model';
import { PaymentCardService } from './payment-card.service';

@Component({
  templateUrl: './payment-card-delete-dialog.component.html'
})
export class PaymentCardDeleteDialogComponent {
  paymentCard?: IPaymentCard;

  constructor(
    protected paymentCardService: PaymentCardService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.paymentCardService.delete(id).subscribe(() => {
      this.eventManager.broadcast('paymentCardListModification');
      this.activeModal.close();
    });
  }
}
