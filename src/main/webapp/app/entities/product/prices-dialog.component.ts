import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ProductItemsDialogType } from './product-items-dialog.component';

import { Price } from '../price';
import { ProductItem, ProductItemService } from '../product-item';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-price-dialog',
    templateUrl: './prices-dialog.component.html'
})
export class PricesDialogComponent implements OnInit {

    productItem: ProductItem;
    productitems: ProductItem[];
    prices: Price[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private productItemService: ProductItemService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        console.error('productItem.prices: ' + this.productItem.prices);
        if (this.productItem.prices) {
            // edited before
            this.prices = this.productItem.prices;
        } else {
            if (this.productItem.id) {
                // load prices from server
                console.error('this.productItem.id: ' + this.productItem.id);
                this.loadItem(this.productItem.id);
            } else {
                // default a price
                this.initPrice();
            }
        }
    }

    loadItem(itemId) {
        this.productItemService.find(itemId).subscribe((productItem) => {
            this.productItem = productItem;
            if (productItem.prices.length > 0) {
                this.prices = productItem.prices;
            } else {
                // default a price
                this.initPrice();
            }
        });
    }

    initPrice() {
        const price: Price = Object.assign(new Price());
        price.tempId = this.uuid();
        this.prices = [price];
    }

    add() {
        const price: Price = Object.assign(new Price());
        price.tempId = this.uuid();
        this.prices.push(price);
    }

    remove(i: number) {
        this.prices.splice(i, 1);
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.eventManager.broadcast({ name: 'priceListModification', content: 'OK'});
        this.activeModal.dismiss('OK');
    }

    confirm() {
        this.productItem.prices = this.prices;
        this.eventManager.broadcast({ name: 'pricesModification', content: 'OK', obj: this.productItem, type: ProductItemsDialogType.SINGLE});
        this.activeModal.dismiss('OK');
    }

    addAndCopyToAll() {
        this.productItem.prices = this.prices;
        this.eventManager.broadcast({ name: 'pricesModification', content: 'OK', obj: this.productItem, type: ProductItemsDialogType.ALL});
        this.activeModal.dismiss('OK');
    }

    private uuid() {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();
    }

    private s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
}
