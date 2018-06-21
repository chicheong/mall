import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ShippingType } from './shipping-type.model';
import { ShippingTypePopupService } from './shipping-type-popup.service';
import { ShippingTypeService } from './shipping-type.service';

@Component({
    selector: 'jhi-shipping-type-delete-dialog',
    templateUrl: './shipping-type-delete-dialog.component.html'
})
export class ShippingTypeDeleteDialogComponent {

    shippingType: ShippingType;

    constructor(
        private shippingTypeService: ShippingTypeService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.shippingTypeService.delete(id).subscribe((response) => {
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

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private shippingTypePopupService: ShippingTypePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.shippingTypePopupService
                .open(ShippingTypeDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
