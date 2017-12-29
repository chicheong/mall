import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ProductItem } from './product-item.model';
import { ProductItemPopupService } from './product-item-popup.service';
import { ProductItemService } from './product-item.service';
import { ProductStyle, ProductStyleService } from '../product-style';
import { Product, ProductService } from '../product';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-product-item-dialog',
    templateUrl: './product-item-dialog.component.html'
})
export class ProductItemDialogComponent implements OnInit {

    productItem: ProductItem;
    isSaving: boolean;

    colors: ProductStyle[];

    sizes: ProductStyle[];

    products: Product[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private productItemService: ProductItemService,
        private productStyleService: ProductStyleService,
        private productService: ProductService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.productStyleService
            .query({filter: 'productitem-is-null'})
            .subscribe((res: ResponseWrapper) => {
                if (!this.productItem.color || !this.productItem.color.id) {
                    this.colors = res.json;
                } else {
                    this.productStyleService
                        .find(this.productItem.color.id)
                        .subscribe((subRes: ProductStyle) => {
                            this.colors = [subRes].concat(res.json);
                        }, (subRes: ResponseWrapper) => this.onError(subRes.json));
                }
            }, (res: ResponseWrapper) => this.onError(res.json));
        this.productStyleService
            .query({filter: 'productitem-is-null'})
            .subscribe((res: ResponseWrapper) => {
                if (!this.productItem.size || !this.productItem.size.id) {
                    this.sizes = res.json;
                } else {
                    this.productStyleService
                        .find(this.productItem.size.id)
                        .subscribe((subRes: ProductStyle) => {
                            this.sizes = [subRes].concat(res.json);
                        }, (subRes: ResponseWrapper) => this.onError(subRes.json));
                }
            }, (res: ResponseWrapper) => this.onError(res.json));
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
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: ProductItem) {
        this.eventManager.broadcast({ name: 'productItemListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackProductStyleById(index: number, item: ProductStyle) {
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
