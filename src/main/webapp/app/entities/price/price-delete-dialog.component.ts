import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Price } from './price.model';
import { PricePopupService } from './price-popup.service';
import { PriceService } from './price.service';

@Component({
    selector: 'jhi-price-delete-dialog',
    templateUrl: './price-delete-dialog.component.html'
})
export class PriceDeleteDialogComponent {

    price: Price;

    constructor(
        private priceService: PriceService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.priceService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'priceListModification',
                content: 'Deleted an price'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-price-delete-popup',
    template: ''
})
export class PriceDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private pricePopupService: PricePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.pricePopupService
                .open(PriceDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
