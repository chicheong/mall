import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IQuantity } from 'app/shared/model/quantity.model';
import { QuantityService } from './quantity.service';

@Component({
  templateUrl: './quantity-delete-dialog.component.html'
})
export class QuantityDeleteDialogComponent {
  quantity?: IQuantity;

  constructor(protected quantityService: QuantityService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.quantityService.delete(id).subscribe(() => {
      this.eventManager.broadcast('quantityListModification');
      this.activeModal.close();
    });
  }
}
