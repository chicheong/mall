import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IProductItem } from 'app/shared/model/product-item.model';
import { IProductStyle } from 'app/shared/model/product-style.model';
import { IPrice } from 'app/shared/model/price.model';
import { IQuantity } from 'app/shared/model/quantity.model';
import { IProduct } from 'app/shared/model/product.model';

import { PricesPopupService } from './prices-popup.service';
import { PricesDialogComponent } from './prices-dialog.component';
import { QuantitiesPopupService } from './quantities-popup.service';
import { QuantitiesDialogComponent } from './quantities-dialog.component';

import { GetItemFromColorSizePipe } from './get-item-from-color-size.pipe';

import { UuidService } from 'app/shared';

@Component({
    selector: 'jhi-product-detail-other-dialog',
    templateUrl: './product-detail-other-dialog.component.html'
})
export class ProductDetailOtherDialogComponent implements OnInit {

    product: IProduct;
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
