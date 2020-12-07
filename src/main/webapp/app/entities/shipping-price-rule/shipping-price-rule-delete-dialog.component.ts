import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IShippingPriceRule } from 'app/shared/model/shipping-price-rule.model';
import { ShippingPriceRuleService } from './shipping-price-rule.service';

@Component({
  templateUrl: './shipping-price-rule-delete-dialog.component.html'
})
export class ShippingPriceRuleDeleteDialogComponent {
  shippingPriceRule?: IShippingPriceRule;

  constructor(
    protected shippingPriceRuleService: ShippingPriceRuleService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.shippingPriceRuleService.delete(id).subscribe(() => {
      this.eventManager.broadcast('shippingPriceRuleListModification');
      this.activeModal.close();
    });
  }
}
