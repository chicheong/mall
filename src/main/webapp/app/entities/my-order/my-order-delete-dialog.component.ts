import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IMyOrder } from 'app/shared/model/my-order.model';
import { MyOrderService } from './my-order.service';

@Component({
  templateUrl: './my-order-delete-dialog.component.html'
})
export class MyOrderDeleteDialogComponent {
  myOrder?: IMyOrder;

  constructor(protected myOrderService: MyOrderService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.myOrderService.delete(id).subscribe(() => {
      this.eventManager.broadcast('myOrderListModification');
      this.activeModal.close();
    });
  }
}
