import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { PaymentCreditCard } from './payment-credit-card.model';
import { PaymentCreditCardPopupService } from './payment-credit-card-popup.service';
import { PaymentCreditCardService } from './payment-credit-card.service';

@Component({
    selector: 'jhi-payment-credit-card-delete-dialog',
    templateUrl: './payment-credit-card-delete-dialog.component.html'
})
export class PaymentCreditCardDeleteDialogComponent {

    paymentCreditCard: PaymentCreditCard;

    constructor(
        private paymentCreditCardService: PaymentCreditCardService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.paymentCreditCardService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'paymentCreditCardListModification',
                content: 'Deleted an paymentCreditCard'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-payment-credit-card-delete-popup',
    template: ''
})
export class PaymentCreditCardDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private paymentCreditCardPopupService: PaymentCreditCardPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.paymentCreditCardPopupService
                .open(PaymentCreditCardDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
