import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ProductItemsDialogType } from './product-items-dialog.component';

import { IPrice, Price } from 'app/shared/model/price.model';
import { IProductItem } from 'app/shared/model/product-item.model';
import { ProductItemService } from 'app/entities/product-item';

import { UuidService } from 'app/shared';

@Component({
    selector: 'jhi-price-dialog',
    templateUrl: './prices-dialog.component.html'
})
export class PricesDialogComponent implements OnInit {

    object: IProductItem;
    productitems: IProductItem[];
    prices: IPrice[];
    broadcastName: string;
    type: string; // Not in use

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private productItemService: ProductItemService,
        private eventManager: JhiEventManager,
        private uuidService: UuidService
    ) {
    }

    ngOnInit() {
        console.error('productItem.prices: ' + this.object.prices);
        if (this.object.dirtyPrices) {
            // edited before
            this.prices = [];
            this.object.prices.forEach(price => {
                const nPrice: IPrice = Object.assign(new Price(), price);
                this.prices.push(nPrice);
            });
        } else {
            if (this.object.id) {
                // load prices from server
                console.error('this.productItem.id: ' + this.object.id);
                this.loadItem(this.object.id);
            } else {
                // default a price
                this.initPrice();
            }
        }
    }

    loadItem(itemId) {
        this.productItemService.find(itemId).subscribe((productItemResponse: HttpResponse<IProductItem>) => {
            this.object = productItemResponse.body;
            if (this.object.prices.length > 0) {
                this.prices = this.object.prices;
            } else {
                // default a price
                this.initPrice();
            }
        });
    }

    initPrice() {
        const price: IPrice = Object.assign(new Price());
        price.tempId = this.uuidService.get();
        this.prices = [price];
    }

    add() {
        const price: IPrice = Object.assign(new Price());
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
        this.object.prices = this.prices;
        this.eventManager.broadcast({ name: this.broadcastName, content: 'OK', obj: this.object, type: ProductItemsDialogType.SINGLE});
        this.activeModal.dismiss('OK');
    }

    addAndCopyToAll() {
        this.object.prices = this.prices;
        this.eventManager.broadcast({ name: this.broadcastName, content: 'OK', obj: this.object, type: ProductItemsDialogType.ALL});
        this.activeModal.dismiss('OK');
    }
}
