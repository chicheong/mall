import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ShippingStatusHistory } from './shipping-status-history.model';
import { ShippingStatusHistoryPopupService } from './shipping-status-history-popup.service';
import { ShippingStatusHistoryService } from './shipping-status-history.service';

@Component({
    selector: 'jhi-shipping-status-history-delete-dialog',
    templateUrl: './shipping-status-history-delete-dialog.component.html'
})
export class ShippingStatusHistoryDeleteDialogComponent {

    shippingStatusHistory: ShippingStatusHistory;

    constructor(
        private shippingStatusHistoryService: ShippingStatusHistoryService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.shippingStatusHistoryService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'shippingStatusHistoryListModification',
                content: 'Deleted an shippingStatusHistory'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-shipping-status-history-delete-popup',
    template: ''
})
export class ShippingStatusHistoryDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private shippingStatusHistoryPopupService: ShippingStatusHistoryPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.shippingStatusHistoryPopupService
                .open(ShippingStatusHistoryDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
