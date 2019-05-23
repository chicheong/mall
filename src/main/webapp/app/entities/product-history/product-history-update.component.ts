import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { IProductHistory } from 'app/shared/model/product-history.model';
import { ProductHistoryService } from './product-history.service';

@Component({
    selector: 'jhi-product-history-update',
    templateUrl: './product-history-update.component.html'
})
export class ProductHistoryUpdateComponent implements OnInit {
    productHistory: IProductHistory;
    isSaving: boolean;
    createdDate: string;

    constructor(protected productHistoryService: ProductHistoryService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ productHistory }) => {
            this.productHistory = productHistory;
            this.createdDate = this.productHistory.createdDate != null ? this.productHistory.createdDate.format(DATE_TIME_FORMAT) : null;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.productHistory.createdDate = this.createdDate != null ? moment(this.createdDate, DATE_TIME_FORMAT) : null;
        if (this.productHistory.id !== undefined) {
            this.subscribeToSaveResponse(this.productHistoryService.update(this.productHistory));
        } else {
            this.subscribeToSaveResponse(this.productHistoryService.create(this.productHistory));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductHistory>>) {
        result.subscribe((res: HttpResponse<IProductHistory>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
