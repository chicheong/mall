import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IOrderStatusHistory } from 'app/shared/model/order-status-history.model';
import { OrderStatusHistoryService } from './order-status-history.service';
import { IMyOrder } from 'app/shared/model/my-order.model';
import { MyOrderService } from 'app/entities/my-order';

@Component({
    selector: 'jhi-order-status-history-update',
    templateUrl: './order-status-history-update.component.html'
})
export class OrderStatusHistoryUpdateComponent implements OnInit {
    orderStatusHistory: IOrderStatusHistory;
    isSaving: boolean;

    myorders: IMyOrder[];
    effectiveDate: string;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected orderStatusHistoryService: OrderStatusHistoryService,
        protected myOrderService: MyOrderService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ orderStatusHistory }) => {
            this.orderStatusHistory = orderStatusHistory;
            this.effectiveDate =
                this.orderStatusHistory.effectiveDate != null ? this.orderStatusHistory.effectiveDate.format(DATE_TIME_FORMAT) : null;
        });
        this.myOrderService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IMyOrder[]>) => mayBeOk.ok),
                map((response: HttpResponse<IMyOrder[]>) => response.body)
            )
            .subscribe((res: IMyOrder[]) => (this.myorders = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.orderStatusHistory.effectiveDate = this.effectiveDate != null ? moment(this.effectiveDate, DATE_TIME_FORMAT) : null;
        if (this.orderStatusHistory.id !== undefined) {
            this.subscribeToSaveResponse(this.orderStatusHistoryService.update(this.orderStatusHistory));
        } else {
            this.subscribeToSaveResponse(this.orderStatusHistoryService.create(this.orderStatusHistory));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrderStatusHistory>>) {
        result.subscribe((res: HttpResponse<IOrderStatusHistory>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackMyOrderById(index: number, item: IMyOrder) {
        return item.id;
    }
}
