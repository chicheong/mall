import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IOrderStatusHistory } from 'app/shared/model/order-status-history.model';
import { OrderStatusHistoryService } from './order-status-history.service';

@Component({
    selector: 'jhi-order-status-history-delete-dialog',
    templateUrl: './order-status-history-delete-dialog.component.html'
})
export class OrderStatusHistoryDeleteDialogComponent {
    orderStatusHistory: IOrderStatusHistory;

    constructor(
        protected orderStatusHistoryService: OrderStatusHistoryService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.orderStatusHistoryService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'orderStatusHistoryListModification',
                content: 'Deleted an orderStatusHistory'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-order-status-history-delete-popup',
    template: ''
})
export class OrderStatusHistoryDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ orderStatusHistory }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(OrderStatusHistoryDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.orderStatusHistory = orderStatusHistory;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/order-status-history', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/order-status-history', { outlets: { popup: null } }]);
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
