import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { PaymentStatusHistory } from './payment-status-history.model';
import { PaymentStatusHistoryPopupService } from './payment-status-history-popup.service';
import { PaymentStatusHistoryService } from './payment-status-history.service';

@Component({
    selector: 'jhi-payment-status-history-delete-dialog',
    templateUrl: './payment-status-history-delete-dialog.component.html'
})
export class PaymentStatusHistoryDeleteDialogComponent {

    paymentStatusHistory: PaymentStatusHistory;

    constructor(
        private paymentStatusHistoryService: PaymentStatusHistoryService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.paymentStatusHistoryService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'paymentStatusHistoryListModification',
                content: 'Deleted an paymentStatusHistory'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-payment-status-history-delete-popup',
    template: ''
})
export class PaymentStatusHistoryDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private paymentStatusHistoryPopupService: PaymentStatusHistoryPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.paymentStatusHistoryPopupService
                .open(PaymentStatusHistoryDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
