import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IMyOrder } from 'app/shared/model/my-order.model';
import { MyOrderService } from './my-order.service';

@Component({
    selector: 'jhi-my-order-delete-dialog',
    templateUrl: './my-order-delete-dialog.component.html'
})
export class MyOrderDeleteDialogComponent {
    myOrder: IMyOrder;

    constructor(protected myOrderService: MyOrderService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.myOrderService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'myOrderListModification',
                content: 'Deleted an myOrder'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-my-order-delete-popup',
    template: ''
})
export class MyOrderDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ myOrder }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(MyOrderDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.myOrder = myOrder;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/my-order', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/my-order', { outlets: { popup: null } }]);
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
