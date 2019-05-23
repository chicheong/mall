import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { IProductStyleHistory } from 'app/shared/model/product-style-history.model';
import { ProductStyleHistoryService } from './product-style-history.service';

@Component({
    selector: 'jhi-product-style-history-update',
    templateUrl: './product-style-history-update.component.html'
})
export class ProductStyleHistoryUpdateComponent implements OnInit {
    productStyleHistory: IProductStyleHistory;
    isSaving: boolean;
    createdDate: string;

    constructor(protected productStyleHistoryService: ProductStyleHistoryService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ productStyleHistory }) => {
            this.productStyleHistory = productStyleHistory;
            this.createdDate =
                this.productStyleHistory.createdDate != null ? this.productStyleHistory.createdDate.format(DATE_TIME_FORMAT) : null;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.productStyleHistory.createdDate = this.createdDate != null ? moment(this.createdDate, DATE_TIME_FORMAT) : null;
        if (this.productStyleHistory.id !== undefined) {
            this.subscribeToSaveResponse(this.productStyleHistoryService.update(this.productStyleHistory));
        } else {
            this.subscribeToSaveResponse(this.productStyleHistoryService.create(this.productStyleHistory));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductStyleHistory>>) {
        result.subscribe((res: HttpResponse<IProductStyleHistory>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
