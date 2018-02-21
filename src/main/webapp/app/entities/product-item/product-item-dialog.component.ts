import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ProductItem } from './product-item.model';
import { ProductItemPopupService } from './product-item-popup.service';
import { ProductItemService } from './product-item.service';
import { ProductStyle, ProductStyleService } from '../product-style';
import { Product, ProductService } from '../product';

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
            .subscribe((res: HttpResponse<ProductStyle[]>) => {
                if (!this.productItem.color || !this.productItem.color.id) {
                    this.colors = res.body;
                } else {
                    this.productStyleService
                        .find(this.productItem.color.id)
                        .subscribe((subRes: HttpResponse<ProductStyle>) => {
                            this.colors = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
        this.productStyleService
            .query({filter: 'productitem-is-null'})
            .subscribe((res: HttpResponse<ProductStyle[]>) => {
                if (!this.productItem.size || !this.productItem.size.id) {
                    this.sizes = res.body;
                } else {
                    this.productStyleService
                        .find(this.productItem.size.id)
                        .subscribe((subRes: HttpResponse<ProductStyle>) => {
                            this.sizes = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
        // this.orderItemService.query()
        //    .subscribe((res: HttpResponse<OrderItem[]>) => { this.orderitems = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.productService.query()
            .subscribe((res: HttpResponse<Product[]>) => { this.products = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
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

    private subscribeToSaveResponse(result: Observable<HttpResponse<ProductItem>>) {
        result.subscribe((res: HttpResponse<ProductItem>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
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
