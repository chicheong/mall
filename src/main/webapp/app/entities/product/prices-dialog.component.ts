import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Price } from '../price';
import { ProductItem } from '../product-item';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-price-dialog',
    templateUrl: './prices-dialog.component.html'
})
export class PricesDialogComponent implements OnInit {

    price: Price;
    isSaving: boolean;

    productitems: ProductItem[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        this.eventManager.broadcast({ name: 'priceListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss('OK');
    }

    trackProductItemById(index: number, item: ProductItem) {
        return item.id;
    }
}
