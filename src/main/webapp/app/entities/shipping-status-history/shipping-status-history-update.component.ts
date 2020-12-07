import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IShippingStatusHistory, ShippingStatusHistory } from 'app/shared/model/shipping-status-history.model';
import { ShippingStatusHistoryService } from './shipping-status-history.service';
import { IShipping } from 'app/shared/model/shipping.model';
import { ShippingService } from 'app/entities/shipping/shipping.service';

@Component({
  selector: 'jhi-shipping-status-history-update',
  templateUrl: './shipping-status-history-update.component.html'
})
export class ShippingStatusHistoryUpdateComponent implements OnInit {
  isSaving = false;
  shippings: IShipping[] = [];

  editForm = this.fb.group({
    id: [],
    effectiveDate: [],
    status: [],
    shipping: []
  });

  constructor(
    protected shippingStatusHistoryService: ShippingStatusHistoryService,
    protected shippingService: ShippingService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shippingStatusHistory }) => {
      if (!shippingStatusHistory.id) {
        const today = moment().startOf('day');
        shippingStatusHistory.effectiveDate = today;
      }

      this.updateForm(shippingStatusHistory);

      this.shippingService.query().subscribe((res: HttpResponse<IShipping[]>) => (this.shippings = res.body || []));
    });
  }

  updateForm(shippingStatusHistory: IShippingStatusHistory): void {
    this.editForm.patchValue({
      id: shippingStatusHistory.id,
      effectiveDate: shippingStatusHistory.effectiveDate ? shippingStatusHistory.effectiveDate.format(DATE_TIME_FORMAT) : null,
      status: shippingStatusHistory.status,
      shipping: shippingStatusHistory.shipping
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const shippingStatusHistory = this.createFromForm();
    if (shippingStatusHistory.id !== undefined) {
      this.subscribeToSaveResponse(this.shippingStatusHistoryService.update(shippingStatusHistory));
    } else {
      this.subscribeToSaveResponse(this.shippingStatusHistoryService.create(shippingStatusHistory));
    }
  }

  private createFromForm(): IShippingStatusHistory {
    return {
      ...new ShippingStatusHistory(),
      id: this.editForm.get(['id'])!.value,
      effectiveDate: this.editForm.get(['effectiveDate'])!.value
        ? moment(this.editForm.get(['effectiveDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      status: this.editForm.get(['status'])!.value,
      shipping: this.editForm.get(['shipping'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IShippingStatusHistory>>): void {
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

  trackById(index: number, item: IShipping): any {
    return item.id;
  }
}
