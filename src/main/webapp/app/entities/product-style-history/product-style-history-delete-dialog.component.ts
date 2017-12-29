import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ProductStyleHistory } from './product-style-history.model';
import { ProductStyleHistoryPopupService } from './product-style-history-popup.service';
import { ProductStyleHistoryService } from './product-style-history.service';

@Component({
    selector: 'jhi-product-style-history-delete-dialog',
    templateUrl: './product-style-history-delete-dialog.component.html'
})
export class ProductStyleHistoryDeleteDialogComponent {

    productStyleHistory: ProductStyleHistory;

    constructor(
        private productStyleHistoryService: ProductStyleHistoryService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.productStyleHistoryService.delete(id).subscribe((response) => {
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

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private productStyleHistoryPopupService: ProductStyleHistoryPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.productStyleHistoryPopupService
                .open(ProductStyleHistoryDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
