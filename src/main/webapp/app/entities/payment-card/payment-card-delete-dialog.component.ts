import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { PaymentCard } from './payment-card.model';
import { PaymentCardPopupService } from './payment-card-popup.service';
import { PaymentCardService } from './payment-card.service';

@Component({
    selector: 'jhi-payment-card-delete-dialog',
    templateUrl: './payment-card-delete-dialog.component.html'
})
export class PaymentCardDeleteDialogComponent {

    paymentCard: PaymentCard;

    constructor(
        private paymentCardService: PaymentCardService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.paymentCardService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'paymentCardListModification',
                content: 'Deleted an paymentCard'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-payment-card-delete-popup',
    template: ''
})
export class PaymentCardDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private paymentCardPopupService: PaymentCardPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.paymentCardPopupService
                .open(PaymentCardDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
