import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ProductItemsDialogType } from './product-items-dialog.component';

import { Quantity } from '../quantity';
import { ProductItem, ProductItemService } from '../product-item';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-quantity-dialog',
    templateUrl: './quantities-dialog.component.html'
})
export class QuantitiesDialogComponent implements OnInit {

    productItem: ProductItem;
    productitems: ProductItem[];
    quantities: Quantity[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private productItemService: ProductItemService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        console.error('productItem.quantities: ' + this.productItem.quantities);
        if (this.productItem.quantities) {
            // edited before
            this.quantities = this.productItem.quantities;
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
            if (productItem.quantities.length > 0) {
                this.quantities = productItem.quantities;
            } else {
                // default a price
                this.initPrice();
            }
        });
    }

    initPrice() {
        const quantity: Quantity = Object.assign(new Quantity());
        quantity.id = this.uuid();
        this.quantities = [quantity];
    }

    add() {
        const quantity: Quantity = Object.assign(new Quantity());
        quantity.id = this.uuid();
        this.quantities.push(quantity);
    }

    remove(i: number) {
        this.quantities.splice(i, 1);
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.eventManager.broadcast({ name: 'quantityListModification', content: 'OK'});
        this.activeModal.dismiss('OK');
    }

    confirm() {
        this.productItem.quantities = this.quantities;
        this.eventManager.broadcast({ name: 'quantitiesModification', content: 'OK', obj: this.productItem, type: ProductItemsDialogType.SINGLE});
        this.activeModal.dismiss('OK');
    }

    addAndCopyToAll() {
        this.productItem.quantities = this.quantities;
        this.eventManager.broadcast({ name: 'quantitiesModification', content: 'OK', obj: this.productItem, type: ProductItemsDialogType.ALL});
        this.activeModal.dismiss('OK');
    }

    private uuid() {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();
    }

    private s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
}
