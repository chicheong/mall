import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IQuantity } from 'app/shared/model/quantity.model';
import { QuantityService } from './quantity.service';

@Component({
    selector: 'jhi-quantity-delete-dialog',
    templateUrl: './quantity-delete-dialog.component.html'
})
export class QuantityDeleteDialogComponent {
    quantity: IQuantity;

    constructor(protected quantityService: QuantityService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.quantityService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'quantityListModification',
                content: 'Deleted an quantity'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-quantity-delete-popup',
    template: ''
})
export class QuantityDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ quantity }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(QuantityDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.quantity = quantity;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/quantity', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/quantity', { outlets: { popup: null } }]);
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
