import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IShippingStatusHistory } from 'app/shared/model/shipping-status-history.model';
import { ShippingStatusHistoryService } from './shipping-status-history.service';

@Component({
  templateUrl: './shipping-status-history-delete-dialog.component.html'
})
export class ShippingStatusHistoryDeleteDialogComponent {
  shippingStatusHistory?: IShippingStatusHistory;

  constructor(
    protected shippingStatusHistoryService: ShippingStatusHistoryService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.shippingStatusHistoryService.delete(id).subscribe(() => {
      this.eventManager.broadcast('shippingStatusHistoryListModification');
      this.activeModal.close();
    });
  }
}
