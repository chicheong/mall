import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IPaymentCard, PaymentCard } from 'app/shared/model/payment-card.model';
import { PaymentCardService } from './payment-card.service';
import { IPayment } from 'app/shared/model/payment.model';
import { PaymentService } from 'app/entities/payment/payment.service';

@Component({
  selector: 'jhi-payment-card-update',
  templateUrl: './payment-card-update.component.html'
})
export class PaymentCardUpdateComponent implements OnInit {
  isSaving = false;
  payments: IPayment[] = [];

  editForm = this.fb.group({
    id: [],
    holderName: [],
    cardNumber: [],
    expirationMonth: [],
    expirationYear: [],
    cvc: [],
    payment: []
  });

  constructor(
    protected paymentCardService: PaymentCardService,
    protected paymentService: PaymentService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paymentCard }) => {
      this.updateForm(paymentCard);

      this.paymentService
        .query({ filter: 'paymentcard-is-null' })
        .pipe(
          map((res: HttpResponse<IPayment[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IPayment[]) => {
          if (!paymentCard.payment || !paymentCard.payment.id) {
            this.payments = resBody;
          } else {
            this.paymentService
              .find(paymentCard.payment.id)
              .pipe(
                map((subRes: HttpResponse<IPayment>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IPayment[]) => (this.payments = concatRes));
          }
        });
    });
  }

  updateForm(paymentCard: IPaymentCard): void {
    this.editForm.patchValue({
      id: paymentCard.id,
      holderName: paymentCard.holderName,
      cardNumber: paymentCard.cardNumber,
      expirationMonth: paymentCard.expirationMonth,
      expirationYear: paymentCard.expirationYear,
      cvc: paymentCard.cvc,
      payment: paymentCard.payment
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const paymentCard = this.createFromForm();
    if (paymentCard.id !== undefined) {
      this.subscribeToSaveResponse(this.paymentCardService.update(paymentCard));
    } else {
      this.subscribeToSaveResponse(this.paymentCardService.create(paymentCard));
    }
  }

  private createFromForm(): IPaymentCard {
    return {
      ...new PaymentCard(),
      id: this.editForm.get(['id'])!.value,
      holderName: this.editForm.get(['holderName'])!.value,
      cardNumber: this.editForm.get(['cardNumber'])!.value,
      expirationMonth: this.editForm.get(['expirationMonth'])!.value,
      expirationYear: this.editForm.get(['expirationYear'])!.value,
      cvc: this.editForm.get(['cvc'])!.value,
      payment: this.editForm.get(['payment'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPaymentCard>>): void {
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
