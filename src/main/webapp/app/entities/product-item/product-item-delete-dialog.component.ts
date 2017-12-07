import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ProductItem } from './product-item.model';
import { ProductItemPopupService } from './product-item-popup.service';
import { ProductItemService } from './product-item.service';

@Component({
    selector: 'jhi-product-item-delete-dialog',
    templateUrl: './product-item-delete-dialog.component.html'
})
export class ProductItemDeleteDialogComponent {

    productItem: ProductItem;

    constructor(
        private productItemService: ProductItemService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.productItemService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'productItemListModification',
                content: 'Deleted an productItem'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-product-item-delete-popup',
    template: ''
})
export class ProductItemDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private productItemPopupService: ProductItemPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.productItemPopupService
                .open(ProductItemDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
