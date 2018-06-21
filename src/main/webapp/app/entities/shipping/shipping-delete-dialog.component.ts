import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Shipping } from './shipping.model';
import { ShippingPopupService } from './shipping-popup.service';
import { ShippingService } from './shipping.service';

@Component({
    selector: 'jhi-shipping-delete-dialog',
    templateUrl: './shipping-delete-dialog.component.html'
})
export class ShippingDeleteDialogComponent {

    shipping: Shipping;

    constructor(
        private shippingService: ShippingService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.shippingService.delete(id).subscribe((response) => {
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

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private shippingPopupService: ShippingPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.shippingPopupService
                .open(ShippingDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
