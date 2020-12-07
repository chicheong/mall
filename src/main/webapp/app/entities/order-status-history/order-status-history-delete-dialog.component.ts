import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IOrderStatusHistory } from 'app/shared/model/order-status-history.model';
import { OrderStatusHistoryService } from './order-status-history.service';

@Component({
  templateUrl: './order-status-history-delete-dialog.component.html'
})
export class OrderStatusHistoryDeleteDialogComponent {
  orderStatusHistory?: IOrderStatusHistory;

  constructor(
    protected orderStatusHistoryService: OrderStatusHistoryService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.orderStatusHistoryService.delete(id).subscribe(() => {
      this.eventManager.broadcast('orderStatusHistoryListModification');
      this.activeModal.close();
    });
  }
}
