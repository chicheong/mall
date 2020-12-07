import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IProductItemHistory } from 'app/shared/model/product-item-history.model';
import { ProductItemHistoryService } from './product-item-history.service';

@Component({
  templateUrl: './product-item-history-delete-dialog.component.html'
})
export class ProductItemHistoryDeleteDialogComponent {
  productItemHistory?: IProductItemHistory;

  constructor(
    protected productItemHistoryService: ProductItemHistoryService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.productItemHistoryService.delete(id).subscribe(() => {
      this.eventManager.broadcast('productItemHistoryListModification');
      this.activeModal.close();
    });
  }
}
