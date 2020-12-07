import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPaymentStatusHistory } from 'app/shared/model/payment-status-history.model';
import { PaymentStatusHistoryService } from './payment-status-history.service';

@Component({
  templateUrl: './payment-status-history-delete-dialog.component.html'
})
export class PaymentStatusHistoryDeleteDialogComponent {
  paymentStatusHistory?: IPaymentStatusHistory;

  constructor(
    protected paymentStatusHistoryService: PaymentStatusHistoryService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.paymentStatusHistoryService.delete(id).subscribe(() => {
      this.eventManager.broadcast('paymentStatusHistoryListModification');
      this.activeModal.close();
    });
  }
}
