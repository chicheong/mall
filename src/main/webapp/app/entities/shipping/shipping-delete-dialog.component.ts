import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IShipping } from 'app/shared/model/shipping.model';
import { ShippingService } from './shipping.service';

@Component({
  templateUrl: './shipping-delete-dialog.component.html'
})
export class ShippingDeleteDialogComponent {
  shipping?: IShipping;

  constructor(protected shippingService: ShippingService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.shippingService.delete(id).subscribe(() => {
      this.eventManager.broadcast('shippingListModification');
      this.activeModal.close();
    });
  }
}
