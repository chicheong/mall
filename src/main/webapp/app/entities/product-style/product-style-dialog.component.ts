import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ProductStyle } from './product-style.model';
import { ProductStylePopupService } from './product-style-popup.service';
import { ProductStyleService } from './product-style.service';
import { Product, ProductService, ProductDetailComponentType } from '../product';

@Component({
    selector: 'jhi-product-style-dialog',
    templateUrl: './product-style-dialog.component.html'
})
export class ProductStyleDialogComponent implements OnInit {

    productStyle: ProductStyle;
    isSaving: boolean;

    products: Product[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private productStyleService: ProductStyleService,
        private productService: ProductService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.productService.query()
            .subscribe((res: HttpResponse<Product[]>) => { this.products = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirm() {
        this.isSaving = true;
        this.eventManager.broadcast({ name: 'productStyleModification', content: 'OK', obj: this.productStyle, type: ProductDetailComponentType.CONFIRM});
        this.isSaving = false;
        this.activeModal.dismiss(this.productStyle);
    }

    delete() {
        this.isSaving = true;
        this.eventManager.broadcast({ name: 'productStyleModification', content: 'OK', obj: this.productStyle, type: ProductDetailComponentType.DELETE});
        this.isSaving = false;
        this.activeModal.dismiss(this.productStyle);
    }

    save() {
        this.isSaving = true;
        if (this.productStyle.id !== undefined) {
            this.subscribeToSaveResponse(
                this.productStyleService.update(this.productStyle));
        } else {
            this.subscribeToSaveResponse(
                this.productStyleService.create(this.productStyle));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ProductStyle>>) {
        result.subscribe((res: HttpResponse<ProductStyle>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: ProductStyle) {
        this.eventManager.broadcast({ name: 'productStyleListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackProductById(index: number, item: Product) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-product-style-popup',
    template: ''
})
export class ProductStylePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private productStylePopupService: ProductStylePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.productStylePopupService
                    .open(ProductStyleDialogComponent as Component, params['id']);
            } else {
                this.productStylePopupService
                    .open(ProductStyleDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
