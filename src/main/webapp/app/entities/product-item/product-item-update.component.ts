import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IProductItem } from 'app/shared/model/product-item.model';
import { ProductItemService } from './product-item.service';
import { IProductStyle } from 'app/shared/model/product-style.model';
import { ProductStyleService } from 'app/entities/product-style';
import { IProduct } from 'app/shared/model/product.model';
import { ProductService } from 'app/entities/product';

@Component({
    selector: 'jhi-product-item-update',
    templateUrl: './product-item-update.component.html'
})
export class ProductItemUpdateComponent implements OnInit {
    productItem: IProductItem;
    isSaving: boolean;

    productstyles: IProductStyle[];

    products: IProduct[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected productItemService: ProductItemService,
        protected productStyleService: ProductStyleService,
        protected productService: ProductService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ productItem }) => {
            this.productItem = productItem;
        });
        this.productStyleService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IProductStyle[]>) => mayBeOk.ok),
                map((response: HttpResponse<IProductStyle[]>) => response.body)
            )
            .subscribe((res: IProductStyle[]) => (this.productstyles = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.productService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IProduct[]>) => mayBeOk.ok),
                map((response: HttpResponse<IProduct[]>) => response.body)
            )
            .subscribe((res: IProduct[]) => (this.products = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.productItem.id !== undefined) {
            this.subscribeToSaveResponse(this.productItemService.update(this.productItem));
        } else {
            this.subscribeToSaveResponse(this.productItemService.create(this.productItem));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductItem>>) {
        result.subscribe((res: HttpResponse<IProductItem>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackProductStyleById(index: number, item: IProductStyle) {
        return item.id;
    }

    trackProductById(index: number, item: IProduct) {
        return item.id;
    }
}
