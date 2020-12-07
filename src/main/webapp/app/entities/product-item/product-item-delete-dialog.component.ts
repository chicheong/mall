import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IProductItem } from 'app/shared/model/product-item.model';
import { ProductItemService } from './product-item.service';

@Component({
  templateUrl: './product-item-delete-dialog.component.html'
})
export class ProductItemDeleteDialogComponent {
  productItem?: IProductItem;

  constructor(
    protected productItemService: ProductItemService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.productItemService.delete(id).subscribe(() => {
      this.eventManager.broadcast('productItemListModification');
      this.activeModal.close();
    });
  }
}
