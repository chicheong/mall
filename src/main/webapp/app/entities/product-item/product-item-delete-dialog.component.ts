import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IProductItem } from 'app/shared/model/product-item.model';
import { ProductItemService } from './product-item.service';

@Component({
    selector: 'jhi-product-item-delete-dialog',
    templateUrl: './product-item-delete-dialog.component.html'
})
export class ProductItemDeleteDialogComponent {
    productItem: IProductItem;

    constructor(
        protected productItemService: ProductItemService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.productItemService.delete(id).subscribe(response => {
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
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ productItem }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(ProductItemDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.productItem = productItem;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/product-item', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/product-item', { outlets: { popup: null } }]);
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
