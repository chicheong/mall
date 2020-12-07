import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IOffice } from 'app/shared/model/office.model';
import { OfficeService } from './office.service';

@Component({
  templateUrl: './office-delete-dialog.component.html'
})
export class OfficeDeleteDialogComponent {
  office?: IOffice;

  constructor(protected officeService: OfficeService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.officeService.delete(id).subscribe(() => {
      this.eventManager.broadcast('officeListModification');
      this.activeModal.close();
    });
  }
}
