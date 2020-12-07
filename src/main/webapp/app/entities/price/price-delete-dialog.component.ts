import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPrice } from 'app/shared/model/price.model';
import { PriceService } from './price.service';

@Component({
  templateUrl: './price-delete-dialog.component.html'
})
export class PriceDeleteDialogComponent {
  price?: IPrice;

  constructor(protected priceService: PriceService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.priceService.delete(id).subscribe(() => {
      this.eventManager.broadcast('priceListModification');
      this.activeModal.close();
    });
  }
}
