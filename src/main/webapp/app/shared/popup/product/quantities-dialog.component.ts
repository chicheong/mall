import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ProductItemsDialogType } from './product-items-dialog.component';

import { IQuantity, Quantity } from 'app/shared/model/quantity.model';
import { IProductItem } from 'app/shared/model/product-item.model';
import { ProductItemService } from 'app/entities/product-item';

import { UuidService } from 'app/shared';

@Component({
    selector: 'jhi-quantity-dialog',
    templateUrl: './quantities-dialog.component.html'
})
export class QuantitiesDialogComponent implements OnInit {

    object: IProductItem;
    productitems: IProductItem[];
    quantities: IQuantity[];
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
        console.error('productItem.quantities: ' + this.object.quantities);
        if (this.object.dirtyQuantities) {
            // edited before
            this.quantities = [];
            this.object.quantities.forEach(quantity => {
                const nQuantity: IQuantity = Object.assign(new Quantity(), quantity);
                this.quantities.push(nQuantity);
            });
        } else {
            if (this.object.id) {
                // load quantities from server
                console.error('this.productItem.id: ' + this.object.id);
                this.loadItem(this.object.id);
            } else {
                // default a Quantity
                this.initQuantity();
            }
        }
    }

    loadItem(itemId) {
        this.productItemService.find(itemId).subscribe((productItemResponse: HttpResponse<IProductItem>) => {
            this.object = productItemResponse.body;
            if (this.object.quantities.length > 0) {
                this.quantities = this.object.quantities;
            } else {
                // default a price
                this.initQuantity();
            }
        });
    }

    initQuantity() {
        const quantity: IQuantity = Object.assign(new Quantity());
        quantity.tempId = this.uuidService.get();
        this.quantities = [quantity];
    }

    add() {
        const quantity: IQuantity = Object.assign(new Quantity());
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
        this.object.quantities = this.quantities;
        this.eventManager.broadcast({ name: this.broadcastName, content: 'OK', obj: this.object, type: ProductItemsDialogType.SINGLE});
        this.activeModal.dismiss('OK');
    }

    addAndCopyToAll() {
        this.object.quantities = this.quantities;
        this.eventManager.broadcast({ name: this.broadcastName, content: 'OK', obj: this.object, type: ProductItemsDialogType.ALL});
        this.activeModal.dismiss('OK');
    }
}
