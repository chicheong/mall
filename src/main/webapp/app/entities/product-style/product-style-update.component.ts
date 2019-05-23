import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IProductStyle } from 'app/shared/model/product-style.model';
import { ProductStyleService } from './product-style.service';
import { IProduct } from 'app/shared/model/product.model';
import { ProductService } from 'app/entities/product';

@Component({
    selector: 'jhi-product-style-update',
    templateUrl: './product-style-update.component.html'
})
export class ProductStyleUpdateComponent implements OnInit {
    productStyle: IProductStyle;
    isSaving: boolean;

    products: IProduct[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected productStyleService: ProductStyleService,
        protected productService: ProductService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ productStyle }) => {
            this.productStyle = productStyle;
        });
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
        if (this.productStyle.id !== undefined) {
            this.subscribeToSaveResponse(this.productStyleService.update(this.productStyle));
        } else {
            this.subscribeToSaveResponse(this.productStyleService.create(this.productStyle));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductStyle>>) {
        result.subscribe((res: HttpResponse<IProductStyle>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackProductById(index: number, item: IProduct) {
        return item.id;
    }
}
