import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IProductHistory } from 'app/shared/model/product-history.model';
import { ProductHistoryService } from './product-history.service';

@Component({
    selector: 'jhi-product-history-delete-dialog',
    templateUrl: './product-history-delete-dialog.component.html'
})
export class ProductHistoryDeleteDialogComponent {
    productHistory: IProductHistory;

    constructor(
        protected productHistoryService: ProductHistoryService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.productHistoryService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'productHistoryListModification',
                content: 'Deleted an productHistory'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-product-history-delete-popup',
    template: ''
})
export class ProductHistoryDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ productHistory }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(ProductHistoryDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.productHistory = productHistory;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/product-history', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/product-history', { outlets: { popup: null } }]);
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
