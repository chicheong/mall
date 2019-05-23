import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IShippingType } from 'app/shared/model/shipping-type.model';
import { ShippingTypeService } from './shipping-type.service';

@Component({
    selector: 'jhi-shipping-type-delete-dialog',
    templateUrl: './shipping-type-delete-dialog.component.html'
})
export class ShippingTypeDeleteDialogComponent {
    shippingType: IShippingType;

    constructor(
        protected shippingTypeService: ShippingTypeService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.shippingTypeService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'shippingTypeListModification',
                content: 'Deleted an shippingType'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-shipping-type-delete-popup',
    template: ''
})
export class ShippingTypeDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ shippingType }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(ShippingTypeDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.shippingType = shippingType;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/shipping-type', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/shipping-type', { outlets: { popup: null } }]);
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
