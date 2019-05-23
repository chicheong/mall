import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPaymentStatusHistory } from 'app/shared/model/payment-status-history.model';
import { PaymentStatusHistoryService } from './payment-status-history.service';

@Component({
    selector: 'jhi-payment-status-history-delete-dialog',
    templateUrl: './payment-status-history-delete-dialog.component.html'
})
export class PaymentStatusHistoryDeleteDialogComponent {
    paymentStatusHistory: IPaymentStatusHistory;

    constructor(
        protected paymentStatusHistoryService: PaymentStatusHistoryService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.paymentStatusHistoryService.delete(id).subscribe(response => {
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
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ paymentStatusHistory }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(PaymentStatusHistoryDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.paymentStatusHistory = paymentStatusHistory;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/payment-status-history', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/payment-status-history', { outlets: { popup: null } }]);
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
