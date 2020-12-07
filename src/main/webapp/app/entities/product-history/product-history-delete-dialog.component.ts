import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IProductHistory } from 'app/shared/model/product-history.model';
import { ProductHistoryService } from './product-history.service';

@Component({
  templateUrl: './product-history-delete-dialog.component.html'
})
export class ProductHistoryDeleteDialogComponent {
  productHistory?: IProductHistory;

  constructor(
    protected productHistoryService: ProductHistoryService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.productHistoryService.delete(id).subscribe(() => {
      this.eventManager.broadcast('productHistoryListModification');
      this.activeModal.close();
    });
  }
}
