import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ProductItem } from '../product-item';
import { ProductStyle } from '../product-style';
import { Price } from '../price';
import { Quantity } from '../quantity';
import { Product } from './product.model';

import { PricesPopupService } from './prices-popup.service';
import { PricesDialogComponent } from './prices-dialog.component';
import { QuantitiesPopupService } from './quantities-popup.service';
import { QuantitiesDialogComponent } from './quantities-dialog.component';

import { GetItemFromColorSizePipe } from './get-item-from-color-size.pipe';

import { UuidService } from '../../shared';

@Component({
    selector: 'jhi-product-detail-other-dialog',
    templateUrl: './product-detail-other-dialog.component.html'
})
export class ProductDetailOtherDialogComponent implements OnInit {

    product: Product;
    private eventSubscriber: Subscription;
    broadcastName: string;

    constructor(
        public activeModal: NgbActiveModal,
        private pricesPopupService: PricesPopupService,
        private quantitiesPopupService: QuantitiesPopupService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private uuidService: UuidService
    ) {
    }

    ngOnInit() {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirm() {
        this.eventManager.broadcast({ name: this.broadcastName, content: 'OK', obj: this.product});
        this.activeModal.dismiss('OK');
    }
}
