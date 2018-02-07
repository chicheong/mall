import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ProductItem } from '../product-item';
import { ProductStyle } from '../product-style';
import { Price } from '../price';
import { Quantity } from '../quantity';
import { Product } from './product.model';
import { ResponseWrapper } from '../../shared';

import { PricesPopupService } from './prices-popup.service';
import { PricesDialogComponent } from './prices-dialog.component';
import { QuantitiesPopupService } from './quantities-popup.service';
import { QuantitiesDialogComponent } from './quantities-dialog.component';

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
        private quantitiesPopupService: QuantitiesPopupService,
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
        this.registerChangeInQuantities();
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

    registerChangeInQuantities() {
        this.eventSubscriber = this.eventManager.subscribe(
            'quantitiesModification', (response) => {
                if (response.type === ProductItemsDialogType.SINGLE) {
                    this.updateQuantities(response.obj);
                } else if (response.type === ProductItemsDialogType.ALL) {
                    this.updateQuantitiesForAll(response.obj);
                }
            }
        );
    }

    updatePrices(productItem: ProductItem) {
        console.error('updatePrices');
        this.productItems.forEach((item) => {
            if (item.id && item.id === productItem.id) {
                console.error('item found');
                item.prices = productItem.prices;
                return;
            } else if (item.tempId && item.tempId === productItem.tempId) {
                console.error('item found');
                item.prices = productItem.prices;
                return;
            }
        })
    }

    updatePricesForAll(productItem: ProductItem) {
        console.error('updatePricesForAll');
        this.productItems.forEach((item) => {
            if (item.id && item.id === productItem.id) {
                item.prices = productItem.prices;
            } else if (item.tempId && item.tempId === productItem.tempId) {
                item.prices = productItem.prices;
            } else {
                item.prices = [];
                productItem.prices.forEach((price) => {
                    const obj: Price = Object.assign(new Price(), price);
                    obj.id = undefined;
                    obj.tempId = this.uuid();
                    item.prices.push(obj);
                })
            }
        })
    }

    updateQuantities(productItem: ProductItem) {
        console.error('updateQuantities');
        this.productItems.forEach((item) => {
            if (item.id && item.id === productItem.id) {
                console.error('item found with id');
                item.quantities = productItem.quantities;
                return;
            } else if (item.tempId && item.tempId === productItem.tempId) {
                console.error('item found with tempId');
                item.quantities = productItem.quantities;
                return;
            }
        })
    }

    updateQuantitiesForAll(productItem: ProductItem) {
        console.error('updateQuantitiesForAll');
        this.productItems.forEach((item) => {
            item.quantities = productItem.quantities;
        })
        this.productItems.forEach((item) => {
            if (item.id && item.id === productItem.id) {
                item.quantities = productItem.quantities;
            } else if (item.tempId && item.tempId === productItem.tempId) {
                console.error('else if');
                item.quantities = productItem.quantities;
            } else {
                item.quantities = [];
                productItem.quantities.forEach((quantity) => {
                    const obj: Quantity = Object.assign(new Quantity(), quantity);
                    obj.id = undefined;
                    obj.tempId = this.uuid();
                    item.quantities.push(obj);
                })
            }
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

    editQuantities(item: ProductItem) {
        console.error('item: ' + item);
        this.quantitiesPopupService.open(QuantitiesDialogComponent as Component, item);
    }

    trackProductStyleById(index: number, item: ProductStyle) {
        return item.id;
    }

    trackProductById(index: number, item: Product) {
        return item.id;
    }

    private uuid() {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();
    }

    private s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
}
