import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IPaymentStatusHistory, PaymentStatusHistory } from 'app/shared/model/payment-status-history.model';
import { PaymentStatusHistoryService } from './payment-status-history.service';
import { IPayment } from 'app/shared/model/payment.model';
import { PaymentService } from 'app/entities/payment/payment.service';

@Component({
  selector: 'jhi-payment-status-history-update',
  templateUrl: './payment-status-history-update.component.html'
})
export class PaymentStatusHistoryUpdateComponent implements OnInit {
  isSaving = false;
  payments: IPayment[] = [];

  editForm = this.fb.group({
    id: [],
    effectiveDate: [],
    status: [],
    payment: []
  });

  constructor(
    protected paymentStatusHistoryService: PaymentStatusHistoryService,
    protected paymentService: PaymentService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paymentStatusHistory }) => {
      if (!paymentStatusHistory.id) {
        const today = moment().startOf('day');
        paymentStatusHistory.effectiveDate = today;
      }

      this.updateForm(paymentStatusHistory);

      this.paymentService.query().subscribe((res: HttpResponse<IPayment[]>) => (this.payments = res.body || []));
    });
  }

  updateForm(paymentStatusHistory: IPaymentStatusHistory): void {
    this.editForm.patchValue({
      id: paymentStatusHistory.id,
      effectiveDate: paymentStatusHistory.effectiveDate ? paymentStatusHistory.effectiveDate.format(DATE_TIME_FORMAT) : null,
      status: paymentStatusHistory.status,
      payment: paymentStatusHistory.payment
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const paymentStatusHistory = this.createFromForm();
    if (paymentStatusHistory.id !== undefined) {
      this.subscribeToSaveResponse(this.paymentStatusHistoryService.update(paymentStatusHistory));
    } else {
      this.subscribeToSaveResponse(this.paymentStatusHistoryService.create(paymentStatusHistory));
    }
  }

  private createFromForm(): IPaymentStatusHistory {
    return {
      ...new PaymentStatusHistory(),
      id: this.editForm.get(['id'])!.value,
      effectiveDate: this.editForm.get(['effectiveDate'])!.value
        ? moment(this.editForm.get(['effectiveDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      status: this.editForm.get(['status'])!.value,
      payment: this.editForm.get(['payment'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPaymentStatusHistory>>): void {
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

  trackById(index: number, item: IPayment): any {
    return item.id;
  }
}
