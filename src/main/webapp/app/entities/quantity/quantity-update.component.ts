import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IQuantity } from 'app/shared/model/quantity.model';
import { QuantityService } from './quantity.service';
import { IProductItem } from 'app/shared/model/product-item.model';
import { ProductItemService } from 'app/entities/product-item';

@Component({
    selector: 'jhi-quantity-update',
    templateUrl: './quantity-update.component.html'
})
export class QuantityUpdateComponent implements OnInit {
    quantity: IQuantity;
    isSaving: boolean;

    productitems: IProductItem[];
    from: string;
    to: string;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected quantityService: QuantityService,
        protected productItemService: ProductItemService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ quantity }) => {
            this.quantity = quantity;
            this.from = this.quantity.from != null ? this.quantity.from.format(DATE_TIME_FORMAT) : null;
            this.to = this.quantity.to != null ? this.quantity.to.format(DATE_TIME_FORMAT) : null;
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
        this.quantity.from = this.from != null ? moment(this.from, DATE_TIME_FORMAT) : null;
        this.quantity.to = this.to != null ? moment(this.to, DATE_TIME_FORMAT) : null;
        if (this.quantity.id !== undefined) {
            this.subscribeToSaveResponse(this.quantityService.update(this.quantity));
        } else {
            this.subscribeToSaveResponse(this.quantityService.create(this.quantity));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IQuantity>>) {
        result.subscribe((res: HttpResponse<IQuantity>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
