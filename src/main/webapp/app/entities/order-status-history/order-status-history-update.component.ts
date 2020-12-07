import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IOrderStatusHistory, OrderStatusHistory } from 'app/shared/model/order-status-history.model';
import { OrderStatusHistoryService } from './order-status-history.service';
import { IMyOrder } from 'app/shared/model/my-order.model';
import { MyOrderService } from 'app/entities/my-order/my-order.service';

@Component({
  selector: 'jhi-order-status-history-update',
  templateUrl: './order-status-history-update.component.html'
})
export class OrderStatusHistoryUpdateComponent implements OnInit {
  isSaving = false;
  myorders: IMyOrder[] = [];

  editForm = this.fb.group({
    id: [],
    effectiveDate: [],
    status: [],
    order: []
  });

  constructor(
    protected orderStatusHistoryService: OrderStatusHistoryService,
    protected myOrderService: MyOrderService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ orderStatusHistory }) => {
      if (!orderStatusHistory.id) {
        const today = moment().startOf('day');
        orderStatusHistory.effectiveDate = today;
      }

      this.updateForm(orderStatusHistory);

      this.myOrderService.query().subscribe((res: HttpResponse<IMyOrder[]>) => (this.myorders = res.body || []));
    });
  }

  updateForm(orderStatusHistory: IOrderStatusHistory): void {
    this.editForm.patchValue({
      id: orderStatusHistory.id,
      effectiveDate: orderStatusHistory.effectiveDate ? orderStatusHistory.effectiveDate.format(DATE_TIME_FORMAT) : null,
      status: orderStatusHistory.status,
      order: orderStatusHistory.order
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const orderStatusHistory = this.createFromForm();
    if (orderStatusHistory.id !== undefined) {
      this.subscribeToSaveResponse(this.orderStatusHistoryService.update(orderStatusHistory));
    } else {
      this.subscribeToSaveResponse(this.orderStatusHistoryService.create(orderStatusHistory));
    }
  }

  private createFromForm(): IOrderStatusHistory {
    return {
      ...new OrderStatusHistory(),
      id: this.editForm.get(['id'])!.value,
      effectiveDate: this.editForm.get(['effectiveDate'])!.value
        ? moment(this.editForm.get(['effectiveDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      status: this.editForm.get(['status'])!.value,
      order: this.editForm.get(['order'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrderStatusHistory>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: IMyOrder): any {
    return item.id;
  }
}
