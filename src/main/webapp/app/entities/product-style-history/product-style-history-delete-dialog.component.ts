import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IProductStyleHistory } from 'app/shared/model/product-style-history.model';
import { ProductStyleHistoryService } from './product-style-history.service';

@Component({
    selector: 'jhi-product-style-history-delete-dialog',
    templateUrl: './product-style-history-delete-dialog.component.html'
})
export class ProductStyleHistoryDeleteDialogComponent {
    productStyleHistory: IProductStyleHistory;

    constructor(
        protected productStyleHistoryService: ProductStyleHistoryService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.productStyleHistoryService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'productStyleHistoryListModification',
                content: 'Deleted an productStyleHistory'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-product-style-history-delete-popup',
    template: ''
})
export class ProductStyleHistoryDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ productStyleHistory }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(ProductStyleHistoryDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.productStyleHistory = productStyleHistory;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/product-style-history', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/product-style-history', { outlets: { popup: null } }]);
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
