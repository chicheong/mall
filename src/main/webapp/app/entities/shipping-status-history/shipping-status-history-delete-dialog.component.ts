import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IShippingStatusHistory } from 'app/shared/model/shipping-status-history.model';
import { ShippingStatusHistoryService } from './shipping-status-history.service';

@Component({
    selector: 'jhi-shipping-status-history-delete-dialog',
    templateUrl: './shipping-status-history-delete-dialog.component.html'
})
export class ShippingStatusHistoryDeleteDialogComponent {
    shippingStatusHistory: IShippingStatusHistory;

    constructor(
        protected shippingStatusHistoryService: ShippingStatusHistoryService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.shippingStatusHistoryService.delete(id).subscribe(response => {
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
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ shippingStatusHistory }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(ShippingStatusHistoryDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.shippingStatusHistory = shippingStatusHistory;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/shipping-status-history', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/shipping-status-history', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
