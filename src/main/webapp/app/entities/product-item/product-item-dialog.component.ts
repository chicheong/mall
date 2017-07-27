import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ProductItem } from './product-item.model';
import { ProductItemPopupService } from './product-item-popup.service';
import { ProductItemService } from './product-item.service';
import { OrderItem, OrderItemService } from '../order-item';
import { Product, ProductService } from '../product';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-product-item-dialog',
    templateUrl: './product-item-dialog.component.html'
})
export class ProductItemDialogComponent implements OnInit {

    productItem: ProductItem;
    isSaving: boolean;

    orderitems: OrderItem[];

    products: Product[];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private productItemService: ProductItemService,
        private orderItemService: OrderItemService,
        private productService: ProductService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.orderItemService.query()
            .subscribe((res: ResponseWrapper) => { this.orderitems = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
        this.productService.query()
            .subscribe((res: ResponseWrapper) => { this.products = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.productItem.id !== undefined) {
            this.subscribeToSaveResponse(
                this.productItemService.update(this.productItem));
        } else {
            this.subscribeToSaveResponse(
                this.productItemService.create(this.productItem));
        }
    }

    private subscribeToSaveResponse(result: Observable<ProductItem>) {
        result.subscribe((res: ProductItem) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: ProductItem) {
        this.eventManager.broadcast({ name: 'productItemListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    trackOrderItemById(index: number, item: OrderItem) {
        return item.id;
    }

    trackProductById(index: number, item: Product) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-product-item-popup',
    template: ''
})
export class ProductItemPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private productItemPopupService: ProductItemPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.productItemPopupService
                    .open(ProductItemDialogComponent as Component, params['id']);
            } else {
                this.productItemPopupService
                    .open(ProductItemDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
