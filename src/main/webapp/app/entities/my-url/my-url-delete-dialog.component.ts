import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IMyUrl } from 'app/shared/model/my-url.model';
import { MyUrlService } from './my-url.service';

@Component({
  templateUrl: './my-url-delete-dialog.component.html'
})
export class MyUrlDeleteDialogComponent {
  url?: IMyUrl;

  constructor(protected urlService: MyUrlService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.urlService.delete(id).subscribe(() => {
      this.eventManager.broadcast('urlListModification');
      this.activeModal.close();
    });
  }
}
