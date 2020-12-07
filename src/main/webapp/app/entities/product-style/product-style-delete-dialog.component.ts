import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IProductStyle } from 'app/shared/model/product-style.model';
import { ProductStyleService } from './product-style.service';

@Component({
  templateUrl: './product-style-delete-dialog.component.html'
})
export class ProductStyleDeleteDialogComponent {
  productStyle?: IProductStyle;

  constructor(
    protected productStyleService: ProductStyleService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.productStyleService.delete(id).subscribe(() => {
      this.eventManager.broadcast('productStyleListModification');
      this.activeModal.close();
    });
  }
}
