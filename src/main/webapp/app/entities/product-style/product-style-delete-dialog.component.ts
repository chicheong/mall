import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ProductStyle } from './product-style.model';
import { ProductStylePopupService } from './product-style-popup.service';
import { ProductStyleService } from './product-style.service';

@Component({
    selector: 'jhi-product-style-delete-dialog',
    templateUrl: './product-style-delete-dialog.component.html'
})
export class ProductStyleDeleteDialogComponent {

    productStyle: ProductStyle;

    constructor(
        private productStyleService: ProductStyleService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.productStyleService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'productStyleListModification',
                content: 'Deleted an productStyle'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-product-style-delete-popup',
    template: ''
})
export class ProductStyleDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private productStylePopupService: ProductStylePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.productStylePopupService
                .open(ProductStyleDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
