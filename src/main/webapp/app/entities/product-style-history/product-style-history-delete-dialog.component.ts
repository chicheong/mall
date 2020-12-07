import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IProductStyleHistory } from 'app/shared/model/product-style-history.model';
import { ProductStyleHistoryService } from './product-style-history.service';

@Component({
  templateUrl: './product-style-history-delete-dialog.component.html'
})
export class ProductStyleHistoryDeleteDialogComponent {
  productStyleHistory?: IProductStyleHistory;

  constructor(
    protected productStyleHistoryService: ProductStyleHistoryService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.productStyleHistoryService.delete(id).subscribe(() => {
      this.eventManager.broadcast('productStyleHistoryListModification');
      this.activeModal.close();
    });
  }
}
