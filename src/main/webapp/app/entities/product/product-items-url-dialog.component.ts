import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ProductItem } from '../product-item';
import { ProductStyle } from '../product-style';
import { Price } from '../price';
import { Quantity } from '../quantity';
import { Product } from './product.model';
import { Url } from './../url';

import { GetItemFromColorSizePipe } from './get-item-from-color-size.pipe';

import { FileUploadResult } from '../../shared/file-upload/file-upload-result.model';

@Component({
    selector: 'jhi-product-item-url-dialog',
    templateUrl: './product-items-url-dialog.component.html'
})
export class ProductItemsUrlDialogComponent implements OnInit {

    product: Product;
    productItems: ProductItem[] = [];
    colors: ProductStyle[];
    sizes: ProductStyle[];
    private eventSubscriber: Subscription;

    fileExt = 'JPG, GIF, PNG';
    maxFiles = 1;
    maxSize = 5; // 5MB
    broadcastName: string;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.product.items.forEach((item) => {
            const productItem: ProductItem = Object.assign(new ProductItem(), item);
            if (!(productItem.url)) {
                const url = new Url();
                url.entityType = ProductItem.name;
                url.entityId = productItem.id ? productItem.id : productItem.tempId;
                url.sequence = 1;
                productItem.url = url;
            }
            this.productItems.push(productItem);
        });
        this.colors = this.product.colors;
        this.sizes = this.product.sizes;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirm() {
        this.product.items = this.productItems;
        this.eventManager.broadcast({ name: this.broadcastName, content: 'OK', obj: this.product});
        this.activeModal.dismiss('OK');
    }

    getResult(result: FileUploadResult) {
        if (result.errors === undefined || result.errors.length === 0) {
            const url = result.urls[0];
            const index = this.productItems.findIndex((item) => item.id ? item.id === url.entityId : item.tempId === url.entityId);
            this.productItems[index].url = url;
            this.productItems[index].dirtyUrl = true;
        } else {
            result.errors.forEach((error) => {
                this.jhiAlertService.error(error.msg, error.params, null);
            });
        }
    }
}
