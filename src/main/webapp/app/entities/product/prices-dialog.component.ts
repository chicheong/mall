import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ProductItemsDialogType } from './product-items-dialog.component';

import { Price } from '../price';
import { ProductItem, ProductItemService } from '../product-item';

import { UuidService } from '../../shared';

@Component({
    selector: 'jhi-price-dialog',
    templateUrl: './prices-dialog.component.html'
})
export class PricesDialogComponent implements OnInit {

    productItem: ProductItem;
    productitems: ProductItem[];
    prices: Price[];
    broadcastName: string;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private productItemService: ProductItemService,
        private eventManager: JhiEventManager,
        private uuidService: UuidService
    ) {
    }

    ngOnInit() {
        console.error('productItem.prices: ' + this.productItem.prices);
        if (this.productItem.dirtyPrices) {
            // edited before
            this.prices = [];
            this.productItem.prices.forEach((price) => {
                const nPrice: Price = Object.assign(new Price(), price);
                this.prices.push(nPrice);
            });
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
        this.productItemService.find(itemId).subscribe((productItemResponse: HttpResponse<ProductItem>) => {
            this.productItem = productItemResponse.body;
            if (this.productItem.prices.length > 0) {
                this.prices = this.productItem.prices;
            } else {
                // default a price
                this.initPrice();
            }
        });
    }

    initPrice() {
        const price: Price = Object.assign(new Price());
        price.tempId = this.uuidService.get();
        this.prices = [price];
    }

    add() {
        const price: Price = Object.assign(new Price());
        price.tempId = this.uuidService.get();
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
        this.eventManager.broadcast({ name: this.broadcastName, content: 'OK', obj: this.productItem, type: ProductItemsDialogType.SINGLE});
        this.activeModal.dismiss('OK');
    }

    addAndCopyToAll() {
        this.productItem.prices = this.prices;
        this.eventManager.broadcast({ name: this.broadcastName, content: 'OK', obj: this.productItem, type: ProductItemsDialogType.ALL});
        this.activeModal.dismiss('OK');
    }
}
