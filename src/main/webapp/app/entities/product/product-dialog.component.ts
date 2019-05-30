import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IProduct } from 'app/shared/model/product.model';
import { ProductPopupService } from './product-popup.service';
import { ProductService } from './product.service';
import { IShop } from 'app/shared/model/shop.model';
import { ShopService } from 'app/entities/shop';
import { ICategory } from 'app/shared/model/category.model';
import { CategoryService } from 'app/entities/category';

@Component({
    selector: 'jhi-product-dialog',
    templateUrl: './product-dialog.component.html'
})
export class ProductDialogComponent implements OnInit {

    product: IProduct;
    isSaving: boolean;

    shops: IShop[];

    categories: ICategory[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private productService: ProductService,
        private shopService: ShopService,
        private categoryService: CategoryService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.shopService.query()
            .subscribe((res: HttpResponse<IShop[]>) => { this.shops = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.categoryService.query()
            .subscribe((res: HttpResponse<ICategory[]>) => { this.categories = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.product.id !== undefined) {
            this.subscribeToSaveResponse(
                this.productService.update(this.product));
        } else {
            this.subscribeToSaveResponse(
                this.productService.create(this.product));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IProduct>>) {
        result.subscribe((res: HttpResponse<IProduct>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: IProduct) {
        this.eventManager.broadcast({ name: 'productListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackShopById(index: number, item: IShop) {
        return item.id;
    }

    trackCategoryById(index: number, item: ICategory) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}

@Component({
    selector: 'jhi-product-popup',
    template: ''
})
export class ProductPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private productPopupService: ProductPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.productPopupService
                    .open(ProductDialogComponent as Component, params['id']);
            } else {
                this.productPopupService
                    .open(ProductDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
