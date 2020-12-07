import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IShop } from 'app/shared/model/shop.model';
import { ShopService } from './shop.service';

@Component({
  templateUrl: './shop-delete-dialog.component.html'
})
export class ShopDeleteDialogComponent {
  shop?: IShop;

  constructor(protected shopService: ShopService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.shopService.delete(id).subscribe(() => {
      this.eventManager.broadcast('shopListModification');
      this.activeModal.close();
    });
  }
}
