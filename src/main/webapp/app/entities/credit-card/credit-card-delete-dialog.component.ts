import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { CreditCard } from './credit-card.model';
import { CreditCardPopupService } from './credit-card-popup.service';
import { CreditCardService } from './credit-card.service';

@Component({
    selector: 'jhi-credit-card-delete-dialog',
    templateUrl: './credit-card-delete-dialog.component.html'
})
export class CreditCardDeleteDialogComponent {

    creditCard: CreditCard;

    constructor(
        private creditCardService: CreditCardService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.creditCardService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'creditCardListModification',
                content: 'Deleted an creditCard'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-credit-card-delete-popup',
    template: ''
})
export class CreditCardDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private creditCardPopupService: CreditCardPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.creditCardPopupService
                .open(CreditCardDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
