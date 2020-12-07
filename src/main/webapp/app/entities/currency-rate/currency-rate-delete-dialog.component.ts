import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICurrencyRate } from 'app/shared/model/currency-rate.model';
import { CurrencyRateService } from './currency-rate.service';

@Component({
  templateUrl: './currency-rate-delete-dialog.component.html'
})
export class CurrencyRateDeleteDialogComponent {
  currencyRate?: ICurrencyRate;

  constructor(
    protected currencyRateService: CurrencyRateService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.currencyRateService.delete(id).subscribe(() => {
      this.eventManager.broadcast('currencyRateListModification');
      this.activeModal.close();
    });
  }
}
