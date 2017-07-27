import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ProductHistory } from './product-history.model';
import { ProductHistoryPopupService } from './product-history-popup.service';
import { ProductHistoryService } from './product-history.service';

@Component({
    selector: 'jhi-product-history-delete-dialog',
    templateUrl: './product-history-delete-dialog.component.html'
})
export class ProductHistoryDeleteDialogComponent {

    productHistory: ProductHistory;

    constructor(
        private productHistoryService: ProductHistoryService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.productHistoryService.delete(id).subscribe((response) => {
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

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private productHistoryPopupService: ProductHistoryPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.productHistoryPopupService
                .open(ProductHistoryDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
