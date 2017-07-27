import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ProductItemHistory } from './product-item-history.model';
import { ProductItemHistoryPopupService } from './product-item-history-popup.service';
import { ProductItemHistoryService } from './product-item-history.service';

@Component({
    selector: 'jhi-product-item-history-delete-dialog',
    templateUrl: './product-item-history-delete-dialog.component.html'
})
export class ProductItemHistoryDeleteDialogComponent {

    productItemHistory: ProductItemHistory;

    constructor(
        private productItemHistoryService: ProductItemHistoryService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.productItemHistoryService.delete(id).subscribe((response) => {
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

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private productItemHistoryPopupService: ProductItemHistoryPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.productItemHistoryPopupService
                .open(ProductItemHistoryDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
