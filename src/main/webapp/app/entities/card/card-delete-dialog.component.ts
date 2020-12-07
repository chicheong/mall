import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICard } from 'app/shared/model/card.model';
import { CardService } from './card.service';

@Component({
  templateUrl: './card-delete-dialog.component.html'
})
export class CardDeleteDialogComponent {
  card?: ICard;

  constructor(protected cardService: CardService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.cardService.delete(id).subscribe(() => {
      this.eventManager.broadcast('cardListModification');
      this.activeModal.close();
    });
  }
}
