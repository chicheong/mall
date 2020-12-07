import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IProductItemHistory, ProductItemHistory } from 'app/shared/model/product-item-history.model';
import { ProductItemHistoryService } from './product-item-history.service';

@Component({
  selector: 'jhi-product-item-history-update',
  templateUrl: './product-item-history-update.component.html'
})
export class ProductItemHistoryUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    code: [],
    isDefault: [],
    quantity: [],
    currency: [],
    price: [],
    createdBy: [],
    createdDate: []
  });

  constructor(
    protected productItemHistoryService: ProductItemHistoryService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productItemHistory }) => {
      if (!productItemHistory.id) {
        const today = moment().startOf('day');
        productItemHistory.createdDate = today;
      }

      this.updateForm(productItemHistory);
    });
  }

  updateForm(productItemHistory: IProductItemHistory): void {
    this.editForm.patchValue({
      id: productItemHistory.id,
      code: productItemHistory.code,
      isDefault: productItemHistory.isDefault,
      quantity: productItemHistory.quantity,
      currency: productItemHistory.currency,
      price: productItemHistory.price,
      createdBy: productItemHistory.createdBy,
      createdDate: productItemHistory.createdDate ? productItemHistory.createdDate.format(DATE_TIME_FORMAT) : null
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const productItemHistory = this.createFromForm();
    if (productItemHistory.id !== undefined) {
      this.subscribeToSaveResponse(this.productItemHistoryService.update(productItemHistory));
    } else {
      this.subscribeToSaveResponse(this.productItemHistoryService.create(productItemHistory));
    }
  }

  private createFromForm(): IProductItemHistory {
    return {
      ...new ProductItemHistory(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      isDefault: this.editForm.get(['isDefault'])!.value,
      quantity: this.editForm.get(['quantity'])!.value,
      currency: this.editForm.get(['currency'])!.value,
      price: this.editForm.get(['price'])!.value,
      createdBy: this.editForm.get(['createdBy'])!.value,
      createdDate: this.editForm.get(['createdDate'])!.value
        ? moment(this.editForm.get(['createdDate'])!.value, DATE_TIME_FORMAT)
        : undefined
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductItemHistory>>): void {
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
