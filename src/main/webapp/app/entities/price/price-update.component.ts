import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IPrice } from 'app/shared/model/price.model';
import { PriceService } from './price.service';
import { IProductItem } from 'app/shared/model/product-item.model';
import { ProductItemService } from 'app/entities/product-item';

@Component({
    selector: 'jhi-price-update',
    templateUrl: './price-update.component.html'
})
export class PriceUpdateComponent implements OnInit {
    price: IPrice;
    isSaving: boolean;

    productitems: IProductItem[];
    from: string;
    to: string;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected priceService: PriceService,
        protected productItemService: ProductItemService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ price }) => {
            this.price = price;
            this.from = this.price.from != null ? this.price.from.format(DATE_TIME_FORMAT) : null;
            this.to = this.price.to != null ? this.price.to.format(DATE_TIME_FORMAT) : null;
        });
        this.productItemService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IProductItem[]>) => mayBeOk.ok),
                map((response: HttpResponse<IProductItem[]>) => response.body)
            )
            .subscribe((res: IProductItem[]) => (this.productitems = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.price.from = this.from != null ? moment(this.from, DATE_TIME_FORMAT) : null;
        this.price.to = this.to != null ? moment(this.to, DATE_TIME_FORMAT) : null;
        if (this.price.id !== undefined) {
            this.subscribeToSaveResponse(this.priceService.update(this.price));
        } else {
            this.subscribeToSaveResponse(this.priceService.create(this.price));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IPrice>>) {
        result.subscribe((res: HttpResponse<IPrice>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackProductItemById(index: number, item: IProductItem) {
        return item.id;
    }
}
