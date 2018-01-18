import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Rx';
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
    QUANTITY = 'QUANTITY',
    SINGLE = 'SINGLE',
    ALL = 'ALL'
}

@Component({
    selector: 'jhi-product-item-dialog',
    templateUrl: './product-items-dialog.component.html'
})
export class ProductItemsDialogComponent implements OnInit {

    product: Product;
    productItems: ProductItem[] = [];
    colors: ProductStyle[];
    sizes: ProductStyle[];
    type: ProductItemsDialogType = ProductItemsDialogType.CODE;
    private eventSubscriber: Subscription;

    constructor(
        public activeModal: NgbActiveModal,
        private pricesPopupService: PricesPopupService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.product.items.forEach((item) => {
            const productItem: ProductItem = Object.assign(new ProductItem(), item);
            this.productItems.push(productItem);
        })
        this.colors = this.product.colors;
        this.sizes = this.product.sizes;

        this.registerChangeInPrices();
    }

    registerChangeInPrices() {
        this.eventSubscriber = this.eventManager.subscribe(
            'pricesModification', (response) => {
                if (response.type === ProductItemsDialogType.SINGLE) {
                    this.updatePrices(response.obj);
                } else if (response.type === ProductItemsDialogType.ALL) {
                    this.updatePricesForAll(response.obj);
                }
            }
        );
    }

    updatePrices(productItem: ProductItem) {
        console.error('updatePrices');
        this.productItems.forEach((item) => {
            if (item.id === productItem.id) {
                console.error('item found');
                item.prices = productItem.prices;
                return;
            }
        })
    }

    updatePricesForAll(productItem: ProductItem) {
        console.error('updatePricesForAll');
        this.productItems.forEach((item) => {
            item.prices = productItem.prices;
        })
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirm() {
        this.product.items = this.productItems;
        this.eventManager.broadcast({ name: 'productItemsModification', content: 'OK', obj: this.product});
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
