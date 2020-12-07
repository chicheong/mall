import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IUserInfo } from 'app/shared/model/user-info.model';
import { UserInfoService } from './user-info.service';

@Component({
  templateUrl: './user-info-delete-dialog.component.html'
})
export class UserInfoDeleteDialogComponent {
  userInfo?: IUserInfo;

  constructor(protected userInfoService: UserInfoService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userInfoService.delete(id).subscribe(() => {
      this.eventManager.broadcast('userInfoListModification');
      this.activeModal.close();
    });
  }
}
