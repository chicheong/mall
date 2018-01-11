import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ProductItem } from '../product-item';
import { ProductStyle } from '../product-style';
import { Product } from './product.model';
import { ResponseWrapper } from '../../shared';

import { PricesPopupService } from './prices-popup.service';
import { PricesDialogComponent } from './prices-dialog.component';

import { GetItemFromColorSizePipe } from './get-item-from-color-size.pipe';

export const enum ProductItemsDialogType {
    CODE = 'CODE',
    PRICE = 'PRICE',
    QUANTITY = 'QUANTITY'
}

@Component({
    selector: 'jhi-product-item-dialog',
    templateUrl: './product-items-dialog.component.html'
})
export class ProductItemsDialogComponent implements OnInit {

    productItems: ProductItem[];
    colors: ProductStyle[];
    sizes: ProductStyle[];
    isSaving: boolean;
    type: ProductItemsDialogType = ProductItemsDialogType.CODE;

    constructor(
        public activeModal: NgbActiveModal,
        private pricesPopupService: PricesPopupService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        console.error(this.productItems);
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirm() {
        this.isSaving = true;
        this.eventManager.broadcast({ name: 'productItemListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss('OK');
    }

    editPrices(item: ProductItem) {
        console.error('item: ' + item);
        this.pricesPopupService.open(PricesDialogComponent as Component, item);
    }

    trackProductStyleById(index: number, item: ProductStyle) {
        return item.id;
    }

    trackProductById(index: number, item: Product) {
        return item.id;
    }
}
