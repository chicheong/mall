import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

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
        private productItemService: ProductItemService,
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        console.error('productItem.prices: ' + this.productItem.prices);
        if (this.productItem.prices) {
            // edited before
            this.prices = this.productItem.prices;
        } else {
            const itemId = this.productItem.id;
            if (itemId instanceof Number) {
                // load prices from server
                console.error('itemId: ' + itemId);
                this.loadItem(itemId);
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
        price.id = this.uuid();
        this.prices = [price];
    }

    add() {
        const price: Price = Object.assign(new Price());
        price.id = this.uuid();
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
        this.eventManager.broadcast({ name: 'pricesModification', content: 'OK', obj: this.productItem});
        this.activeModal.dismiss('OK');
    }

    private uuid() {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();
    }

    private s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
}
