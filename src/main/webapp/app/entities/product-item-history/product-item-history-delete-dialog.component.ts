import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IProductItemHistory } from 'app/shared/model/product-item-history.model';
import { ProductItemHistoryService } from './product-item-history.service';

@Component({
    selector: 'jhi-product-item-history-delete-dialog',
    templateUrl: './product-item-history-delete-dialog.component.html'
})
export class ProductItemHistoryDeleteDialogComponent {
    productItemHistory: IProductItemHistory;

    constructor(
        protected productItemHistoryService: ProductItemHistoryService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.productItemHistoryService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'productItemHistoryListModification',
                content: 'Deleted an productItemHistory'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-product-item-history-delete-popup',
    template: ''
})
export class ProductItemHistoryDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ productItemHistory }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(ProductItemHistoryDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.productItemHistory = productItemHistory;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/product-item-history', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/product-item-history', { outlets: { popup: null } }]);
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
