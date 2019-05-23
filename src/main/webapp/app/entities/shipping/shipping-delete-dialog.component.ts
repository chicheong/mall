import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IShipping } from 'app/shared/model/shipping.model';
import { ShippingService } from './shipping.service';

@Component({
    selector: 'jhi-shipping-delete-dialog',
    templateUrl: './shipping-delete-dialog.component.html'
})
export class ShippingDeleteDialogComponent {
    shipping: IShipping;

    constructor(protected shippingService: ShippingService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.shippingService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'shippingListModification',
                content: 'Deleted an shipping'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-shipping-delete-popup',
    template: ''
})
export class ShippingDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ shipping }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(ShippingDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.shipping = shipping;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/shipping', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/shipping', { outlets: { popup: null } }]);
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
