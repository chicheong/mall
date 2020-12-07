import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IShippingType } from 'app/shared/model/shipping-type.model';
import { ShippingTypeService } from './shipping-type.service';

@Component({
  templateUrl: './shipping-type-delete-dialog.component.html'
})
export class ShippingTypeDeleteDialogComponent {
  shippingType?: IShippingType;

  constructor(
    protected shippingTypeService: ShippingTypeService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.shippingTypeService.delete(id).subscribe(() => {
      this.eventManager.broadcast('shippingTypeListModification');
      this.activeModal.close();
    });
  }
}
