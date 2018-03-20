import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ProductItemsDialogType } from './product-items-dialog.component';

import { Product } from './product.model';

import { UuidService } from '../../shared';

@Component({
    selector: 'jhi-file-upload-dialog',
    templateUrl: './file-upload-dialog.component.html'
})
export class FileUploadDialogComponent implements OnInit {

    product: Product;
    fileToUpload: FileList;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private uuidService: UuidService
    ) {
    }

    ngOnInit() {
//        if (this.productItem.dirtyPrices) {
//            // edited before
//            this.prices = [];
//            this.productItem.prices.forEach((price) => {
//                const nPrice: Price = Object.assign(new Price(), price);
//                this.prices.push(nPrice);
//            });
//        } else {
//            if (this.productItem.id) {
//                // load prices from server
//                console.error('this.productItem.id: ' + this.productItem.id);
//                this.loadItem(this.productItem.id);
//            } else {
//                // default a price
//                this.initPrice();
//            }
//        }
    }

    loadItem(itemId) {
//        this.productItemService.find(itemId).subscribe((productItemResponse: HttpResponse<ProductItem>) => {
//            this.productItem = productItemResponse.body;
//            if (this.productItem.prices.length > 0) {
//                this.prices = this.productItem.prices;
//            } else {
//                // default a price
//                this.initPrice();
//            }
//        });
    }

    initPrice() {
//        const price: Price = Object.assign(new Price());
//        price.tempId = this.uuidService.get();
//        this.prices = [price];
    }

    handleFileInput(files: FileList) {
        this.fileToUpload = files;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.eventManager.broadcast({ name: 'priceListModification', content: 'OK'});
        this.activeModal.dismiss('OK');
    }

    confirm() {
//        this.productItem.prices = this.prices;
//        this.eventManager.broadcast({ name: 'pricesModification', content: 'OK', obj: this.productItem, type: ProductItemsDialogType.SINGLE});
        this.activeModal.dismiss('OK');
    }
}
