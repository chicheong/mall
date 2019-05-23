import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IProductStyle } from 'app/shared/model/product-style.model';
import { ProductStyleService } from './product-style.service';

@Component({
    selector: 'jhi-product-style-delete-dialog',
    templateUrl: './product-style-delete-dialog.component.html'
})
export class ProductStyleDeleteDialogComponent {
    productStyle: IProductStyle;

    constructor(
        protected productStyleService: ProductStyleService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.productStyleService.delete(id).subscribe(response => {
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
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ productStyle }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(ProductStyleDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.productStyle = productStyle;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/product-style', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/product-style', { outlets: { popup: null } }]);
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
