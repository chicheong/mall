import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { ICurrencyRate, CurrencyRate } from 'app/shared/model/currency-rate.model';
import { CurrencyRateService } from './currency-rate.service';

@Component({
  selector: 'jhi-currency-rate-update',
  templateUrl: './currency-rate-update.component.html'
})
export class CurrencyRateUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    from: [],
    to: [],
    rate: [],
    sourceCurrency: [],
    targetCurrency: []
  });

  constructor(protected currencyRateService: CurrencyRateService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ currencyRate }) => {
      if (!currencyRate.id) {
        const today = moment().startOf('day');
        currencyRate.from = today;
        currencyRate.to = today;
      }

      this.updateForm(currencyRate);
    });
  }

  updateForm(currencyRate: ICurrencyRate): void {
    this.editForm.patchValue({
      id: currencyRate.id,
      from: currencyRate.from ? currencyRate.from.format(DATE_TIME_FORMAT) : null,
      to: currencyRate.to ? currencyRate.to.format(DATE_TIME_FORMAT) : null,
      rate: currencyRate.rate,
      sourceCurrency: currencyRate.sourceCurrency,
      targetCurrency: currencyRate.targetCurrency
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const currencyRate = this.createFromForm();
    if (currencyRate.id !== undefined) {
      this.subscribeToSaveResponse(this.currencyRateService.update(currencyRate));
    } else {
      this.subscribeToSaveResponse(this.currencyRateService.create(currencyRate));
    }
  }

  private createFromForm(): ICurrencyRate {
    return {
      ...new CurrencyRate(),
      id: this.editForm.get(['id'])!.value,
      from: this.editForm.get(['from'])!.value ? moment(this.editForm.get(['from'])!.value, DATE_TIME_FORMAT) : undefined,
      to: this.editForm.get(['to'])!.value ? moment(this.editForm.get(['to'])!.value, DATE_TIME_FORMAT) : undefined,
      rate: this.editForm.get(['rate'])!.value,
      sourceCurrency: this.editForm.get(['sourceCurrency'])!.value,
      targetCurrency: this.editForm.get(['targetCurrency'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICurrencyRate>>): void {
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
}
