import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IPayment, Payment } from 'app/shared/model/payment.model';
import { PaymentService } from './payment.service';
import { IMyOrder } from 'app/shared/model/my-order.model';
import { MyOrderService } from 'app/entities/my-order/my-order.service';

@Component({
  selector: 'jhi-payment-update',
  templateUrl: './payment-update.component.html'
})
export class PaymentUpdateComponent implements OnInit {
  isSaving = false;
  orders: IMyOrder[] = [];

  editForm = this.fb.group({
    id: [],
    amount: [],
    currency: [],
    type: [],
    remark: [],
    status: [],
    order: []
  });

  constructor(
    protected paymentService: PaymentService,
    protected myOrderService: MyOrderService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ payment }) => {
      this.updateForm(payment);

      this.myOrderService
        .query({ filter: 'payment-is-null' })
        .pipe(
          map((res: HttpResponse<IMyOrder[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IMyOrder[]) => {
          if (!payment.orderId) {
            this.orders = resBody;
          } else {
            this.myOrderService
              .find(payment.orderId)
              .pipe(
                map((subRes: HttpResponse<IMyOrder>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IMyOrder[]) => (this.orders = concatRes));
          }
        });
    });
  }

  updateForm(payment: IPayment): void {
    this.editForm.patchValue({
      id: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      type: payment.type,
      remark: payment.remark,
      status: payment.status,
      order: payment.order
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const payment = this.createFromForm();
    if (payment.id !== undefined) {
      this.subscribeToSaveResponse(this.paymentService.update(payment));
    } else {
      this.subscribeToSaveResponse(this.paymentService.create(payment));
    }
  }

  private createFromForm(): IPayment {
    return {
      ...new Payment(),
      id: this.editForm.get(['id'])!.value,
      amount: this.editForm.get(['amount'])!.value,
      currency: this.editForm.get(['currency'])!.value,
      type: this.editForm.get(['type'])!.value,
      remark: this.editForm.get(['remark'])!.value,
      status: this.editForm.get(['status'])!.value,
      order: this.editForm.get(['order'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPayment>>): void {
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
