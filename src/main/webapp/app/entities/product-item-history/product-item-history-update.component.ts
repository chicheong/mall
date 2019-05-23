import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { IProductItemHistory } from 'app/shared/model/product-item-history.model';
import { ProductItemHistoryService } from './product-item-history.service';

@Component({
    selector: 'jhi-product-item-history-update',
    templateUrl: './product-item-history-update.component.html'
})
export class ProductItemHistoryUpdateComponent implements OnInit {
    productItemHistory: IProductItemHistory;
    isSaving: boolean;
    createdDate: string;

    constructor(protected productItemHistoryService: ProductItemHistoryService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ productItemHistory }) => {
            this.productItemHistory = productItemHistory;
            this.createdDate =
                this.productItemHistory.createdDate != null ? this.productItemHistory.createdDate.format(DATE_TIME_FORMAT) : null;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.productItemHistory.createdDate = this.createdDate != null ? moment(this.createdDate, DATE_TIME_FORMAT) : null;
        if (this.productItemHistory.id !== undefined) {
            this.subscribeToSaveResponse(this.productItemHistoryService.update(this.productItemHistory));
        } else {
            this.subscribeToSaveResponse(this.productItemHistoryService.create(this.productItemHistory));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductItemHistory>>) {
        result.subscribe((res: HttpResponse<IProductItemHistory>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
