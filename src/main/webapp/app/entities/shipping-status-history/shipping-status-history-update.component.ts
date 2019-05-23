import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IShippingStatusHistory } from 'app/shared/model/shipping-status-history.model';
import { ShippingStatusHistoryService } from './shipping-status-history.service';
import { IShipping } from 'app/shared/model/shipping.model';
import { ShippingService } from 'app/entities/shipping';

@Component({
    selector: 'jhi-shipping-status-history-update',
    templateUrl: './shipping-status-history-update.component.html'
})
export class ShippingStatusHistoryUpdateComponent implements OnInit {
    shippingStatusHistory: IShippingStatusHistory;
    isSaving: boolean;

    shippings: IShipping[];
    effectiveDate: string;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected shippingStatusHistoryService: ShippingStatusHistoryService,
        protected shippingService: ShippingService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ shippingStatusHistory }) => {
            this.shippingStatusHistory = shippingStatusHistory;
            this.effectiveDate =
                this.shippingStatusHistory.effectiveDate != null ? this.shippingStatusHistory.effectiveDate.format(DATE_TIME_FORMAT) : null;
        });
        this.shippingService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IShipping[]>) => mayBeOk.ok),
                map((response: HttpResponse<IShipping[]>) => response.body)
            )
            .subscribe((res: IShipping[]) => (this.shippings = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.shippingStatusHistory.effectiveDate = this.effectiveDate != null ? moment(this.effectiveDate, DATE_TIME_FORMAT) : null;
        if (this.shippingStatusHistory.id !== undefined) {
            this.subscribeToSaveResponse(this.shippingStatusHistoryService.update(this.shippingStatusHistory));
        } else {
            this.subscribeToSaveResponse(this.shippingStatusHistoryService.create(this.shippingStatusHistory));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IShippingStatusHistory>>) {
        result.subscribe(
            (res: HttpResponse<IShippingStatusHistory>) => this.onSaveSuccess(),
            (res: HttpErrorResponse) => this.onSaveError()
        );
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

    trackShippingById(index: number, item: IShipping) {
        return item.id;
    }
}
