import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IMyAccount } from 'app/shared/model/my-account.model';
import { MyAccountService } from './my-account.service';

@Component({
  templateUrl: './my-account-delete-dialog.component.html'
})
export class MyAccountDeleteDialogComponent {
  myAccount?: IMyAccount;

  constructor(protected myAccountService: MyAccountService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.myAccountService.delete(id).subscribe(() => {
      this.eventManager.broadcast('myAccountListModification');
      this.activeModal.close();
    });
  }
}
