import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IProductItem, ProductItem } from 'app/shared/model/product-item.model';
import { IProductStyle } from 'app/shared/model/product-style.model';
import { IPrice, Price } from 'app/shared/model/price.model';
import { IQuantity, Quantity } from 'app/shared/model/quantity.model';
import { IProduct } from 'app/shared/model/product.model';

import { PopupService } from 'app/shared';
import { PricesDialogComponent } from './prices-dialog.component';
import { QuantitiesDialogComponent } from './quantities-dialog.component';

import { GetItemFromColorSizePipe } from './get-item-from-color-size.pipe';

import { UuidService } from 'app/shared';

export const enum ProductItemsDialogType {
    CODE = 'CODE',
    PRICE = 'PRICE',
    QUANTITY = 'QUANTITY',
    SINGLE = 'SINGLE',
    ALL = 'ALL'
}
export const enum ProductItemsBroadcastName {
    PRICES = 'pricesModification',
    QUANTITIES = 'quantitiesModification'
}

@Component({
    selector: 'jhi-product-item-dialog',
    templateUrl: './product-items-dialog.component.html'
})
export class ProductItemsDialogComponent implements OnInit {

    private eventSubscriber: Subscription;

    object: IProduct;
    productItems: IProductItem[] = [];
    colors: IProductStyle[];
    sizes: IProductStyle[];

    broadcastName: string;
    type: string;

    constructor(
        public activeModal: NgbActiveModal,
        private popupService: PopupService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private uuidService: UuidService
    ) {
    }

    ngOnInit() {
        this.object.items.forEach(item => {
            const productItem: IProductItem = Object.assign(new ProductItem(), item);
            this.productItems.push(productItem);
        });
        this.colors = this.object.colors;
        this.sizes = this.object.sizes;

        this.registerChangeInPrices();
        this.registerChangeInQuantities();
    }

    registerChangeInPrices() {
        this.eventSubscriber = this.eventManager.subscribe(
            ProductItemsBroadcastName.PRICES, response => {
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
            ProductItemsBroadcastName.QUANTITIES, response => {
                if (response.type === ProductItemsDialogType.SINGLE) {
                    this.updateQuantities(response.obj);
                } else if (response.type === ProductItemsDialogType.ALL) {
                    this.updateQuantitiesForAll(response.obj);
                }
            }
        );
    }

    updatePrices(productItem: IProductItem) {
        console.error('updatePrices');
        this.productItems.forEach(item => {
            if (item.id && item.id === productItem.id) {
                console.error('item found');
                item.prices = productItem.prices;
                item.dirtyPrices = true;
                return;
            } else if (item.tempId && item.tempId === productItem.tempId) {
                console.error('item found');
                item.prices = productItem.prices;
                item.dirtyPrices = true;
                return;
            }
        });
    }

    updatePricesForAll(productItem: IProductItem) {
        console.error('updatePricesForAll');
        this.productItems.forEach(item => {
            if (item.id && item.id === productItem.id) {
                item.prices = productItem.prices;
            } else if (item.tempId && item.tempId === productItem.tempId) {
                item.prices = productItem.prices;
            } else {
                item.prices = [];
                productItem.prices.forEach(price => {
                    const obj: IPrice = Object.assign(new Price(), price);
                    obj.id = undefined;
                    obj.tempId = this.uuidService.get();
                    item.prices.push(obj);
                });
            }
            item.dirtyPrices = true;
        });
    }

    updateQuantities(productItem: IProductItem) {
        console.error('updateQuantities');
        this.productItems.forEach(item => {
            if (item.id && item.id === productItem.id) {
                console.error('item found with id');
                item.quantities = productItem.quantities;
                item.dirtyQuantities = true;
                return;
            } else if (item.tempId && item.tempId === productItem.tempId) {
                console.error('item found with tempId');
                item.quantities = productItem.quantities;
                item.dirtyQuantities = true;
                return;
            }
        });
    }

    updateQuantitiesForAll(productItem: IProductItem) {
        console.error('updateQuantitiesForAll');
        this.productItems.forEach(item => {
            item.quantities = productItem.quantities;
        });
        this.productItems.forEach(item => {
            if (item.id && item.id === productItem.id) {
                item.quantities = productItem.quantities;
            } else if (item.tempId && item.tempId === productItem.tempId) {
                console.error('else if');
                item.quantities = productItem.quantities;
            } else {
                item.quantities = [];
                productItem.quantities.forEach(quantity => {
                    const obj: Quantity = Object.assign(new Quantity(), quantity);
                    obj.id = undefined;
                    obj.tempId = this.uuidService.get();
                    item.quantities.push(obj);
                });
            }
            item.dirtyQuantities = true;
        });
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirm() {
        this.object.items = this.productItems;
        this.eventManager.broadcast({ name: this.broadcastName, content: 'OK', obj: this.object});
        this.activeModal.dismiss('OK');
    }

    editPrices(item: IProductItem) {
        console.error('item: ' + item);
        this.popupService.open(PricesDialogComponent as Component, item, ProductItemsBroadcastName.PRICES);
    }

    editQuantities(item: IProductItem) {
        console.error('item: ' + item);
        this.popupService.open(QuantitiesDialogComponent as Component, item, ProductItemsBroadcastName.QUANTITIES);
    }

    trackProductStyleById(index: number, item: IProductStyle) {
        return item.id;
    }

    trackProductById(index: number, item: IProduct) {
        return item.id;
    }
}
