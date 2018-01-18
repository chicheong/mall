import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Quantity } from './quantity.model';
import { QuantityPopupService } from './quantity-popup.service';
import { QuantityService } from './quantity.service';

@Component({
    selector: 'jhi-quantity-delete-dialog',
    templateUrl: './quantity-delete-dialog.component.html'
})
export class QuantityDeleteDialogComponent {

    quantity: Quantity;

    constructor(
        private quantityService: QuantityService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.quantityService.delete(id).subscribe((response) => {
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

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private quantityPopupService: QuantityPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.quantityPopupService
                .open(QuantityDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
