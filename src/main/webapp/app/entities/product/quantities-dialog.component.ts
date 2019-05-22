import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ProductItemsDialogType } from './product-items-dialog.component';

import { Quantity } from '../quantity';
import { ProductItem, ProductItemService } from '../product-item';

import { UuidService } from '../../shared';

@Component({
    selector: 'jhi-quantity-dialog',
    templateUrl: './quantities-dialog.component.html'
})
export class QuantitiesDialogComponent implements OnInit {

    productItem: ProductItem;
    productitems: ProductItem[];
    quantities: Quantity[];
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
        console.error('productItem.quantities: ' + this.productItem.quantities);
        if (this.productItem.dirtyQuantities) {
            // edited before
            this.quantities = [];
            this.productItem.quantities.forEach((quantity) => {
                const nQuantity: Quantity = Object.assign(new Quantity(), quantity);
                this.quantities.push(nQuantity);
            });
        } else {
            if (this.productItem.id) {
                // load quantities from server
                console.error('this.productItem.id: ' + this.productItem.id);
                this.loadItem(this.productItem.id);
            } else {
                // default a Quantity
                this.initQuantity();
            }
        }
    }

    loadItem(itemId) {
        this.productItemService.find(itemId).subscribe((productItemResponse: HttpResponse<ProductItem>) => {
            this.productItem = productItemResponse.body;
            if (this.productItem.quantities.length > 0) {
                this.quantities = this.productItem.quantities;
            } else {
                // default a price
                this.initQuantity();
            }
        });
    }

    initQuantity() {
        const quantity: Quantity = Object.assign(new Quantity());
        quantity.tempId = this.uuidService.get();
        this.quantities = [quantity];
    }

    add() {
        const quantity: Quantity = Object.assign(new Quantity());
        quantity.tempId = this.uuidService.get();
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
        this.eventManager.broadcast({ name: this.broadcastName, content: 'OK', obj: this.productItem, type: ProductItemsDialogType.SINGLE});
        this.activeModal.dismiss('OK');
    }

    addAndCopyToAll() {
        this.productItem.quantities = this.quantities;
        this.eventManager.broadcast({ name: this.broadcastName, content: 'OK', obj: this.productItem, type: ProductItemsDialogType.ALL});
        this.activeModal.dismiss('OK');
    }
}
