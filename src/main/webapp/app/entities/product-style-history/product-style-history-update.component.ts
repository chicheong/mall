import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IProductStyleHistory, ProductStyleHistory } from 'app/shared/model/product-style-history.model';
import { ProductStyleHistoryService } from './product-style-history.service';

@Component({
  selector: 'jhi-product-style-history-update',
  templateUrl: './product-style-history-update.component.html'
})
export class ProductStyleHistoryUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [],
    code: [],
    isDefault: [],
    type: [],
    createdBy: [],
    createdDate: []
  });

  constructor(
    protected productStyleHistoryService: ProductStyleHistoryService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productStyleHistory }) => {
      if (!productStyleHistory.id) {
        const today = moment().startOf('day');
        productStyleHistory.createdDate = today;
      }

      this.updateForm(productStyleHistory);
    });
  }

  updateForm(productStyleHistory: IProductStyleHistory): void {
    this.editForm.patchValue({
      id: productStyleHistory.id,
      name: productStyleHistory.name,
      code: productStyleHistory.code,
      isDefault: productStyleHistory.isDefault,
      type: productStyleHistory.type,
      createdBy: productStyleHistory.createdBy,
      createdDate: productStyleHistory.createdDate ? productStyleHistory.createdDate.format(DATE_TIME_FORMAT) : null
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const productStyleHistory = this.createFromForm();
    if (productStyleHistory.id !== undefined) {
      this.subscribeToSaveResponse(this.productStyleHistoryService.update(productStyleHistory));
    } else {
      this.subscribeToSaveResponse(this.productStyleHistoryService.create(productStyleHistory));
    }
  }

  private createFromForm(): IProductStyleHistory {
    return {
      ...new ProductStyleHistory(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      code: this.editForm.get(['code'])!.value,
      isDefault: this.editForm.get(['isDefault'])!.value,
      type: this.editForm.get(['type'])!.value,
      createdBy: this.editForm.get(['createdBy'])!.value,
      createdDate: this.editForm.get(['createdDate'])!.value
        ? moment(this.editForm.get(['createdDate'])!.value, DATE_TIME_FORMAT)
        : undefined
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductStyleHistory>>): void {
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
