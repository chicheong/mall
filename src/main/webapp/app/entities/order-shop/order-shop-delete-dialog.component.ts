import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IOrderShop } from 'app/shared/model/order-shop.model';
import { OrderShopService } from './order-shop.service';

@Component({
  templateUrl: './order-shop-delete-dialog.component.html'
})
export class OrderShopDeleteDialogComponent {
  orderShop?: IOrderShop;

  constructor(protected orderShopService: OrderShopService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.orderShopService.delete(id).subscribe(() => {
      this.eventManager.broadcast('orderShopListModification');
      this.activeModal.close();
    });
  }
}
