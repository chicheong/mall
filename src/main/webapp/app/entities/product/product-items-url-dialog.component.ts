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
    broadcastName = 'productItemsUrlModification';

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.product.items.forEach((item) => {
            const productItem: ProductItem = Object.assign(new ProductItem(), item);
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
            // result.urls[0].entityId
        } else {
            result.errors.forEach((error) => {
                this.jhiAlertService.error(error.msg, error.params, null);
            });
        }
    }
}
