import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IMyState } from 'app/shared/model/my-state.model';
import { MyStateService } from './my-state.service';

@Component({
  templateUrl: './my-state-delete-dialog.component.html'
})
export class MyStateDeleteDialogComponent {
  myState?: IMyState;

  constructor(protected myStateService: MyStateService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.myStateService.delete(id).subscribe(() => {
      this.eventManager.broadcast('myStateListModification');
      this.activeModal.close();
    });
  }
}
