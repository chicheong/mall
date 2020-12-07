import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IProductHistory, ProductHistory } from 'app/shared/model/product-history.model';
import { ProductHistoryService } from './product-history.service';

@Component({
  selector: 'jhi-product-history-update',
  templateUrl: './product-history-update.component.html'
})
export class ProductHistoryUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    productId: [],
    name: [null, [Validators.required]],
    code: [],
    brand: [],
    description: [],
    content: [],
    remark: [],
    status: [],
    createdBy: [],
    createdDate: []
  });

  constructor(protected productHistoryService: ProductHistoryService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productHistory }) => {
      if (!productHistory.id) {
        const today = moment().startOf('day');
        productHistory.createdDate = today;
      }

      this.updateForm(productHistory);
    });
  }

  updateForm(productHistory: IProductHistory): void {
    this.editForm.patchValue({
      id: productHistory.id,
      productId: productHistory.productId,
      name: productHistory.name,
      code: productHistory.code,
      brand: productHistory.brand,
      description: productHistory.description,
      content: productHistory.content,
      remark: productHistory.remark,
      status: productHistory.status,
      createdBy: productHistory.createdBy,
      createdDate: productHistory.createdDate ? productHistory.createdDate.format(DATE_TIME_FORMAT) : null
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const productHistory = this.createFromForm();
    if (productHistory.id !== undefined) {
      this.subscribeToSaveResponse(this.productHistoryService.update(productHistory));
    } else {
      this.subscribeToSaveResponse(this.productHistoryService.create(productHistory));
    }
  }

  private createFromForm(): IProductHistory {
    return {
      ...new ProductHistory(),
      id: this.editForm.get(['id'])!.value,
      productId: this.editForm.get(['productId'])!.value,
      name: this.editForm.get(['name'])!.value,
      code: this.editForm.get(['code'])!.value,
      brand: this.editForm.get(['brand'])!.value,
      description: this.editForm.get(['description'])!.value,
      content: this.editForm.get(['content'])!.value,
      remark: this.editForm.get(['remark'])!.value,
      status: this.editForm.get(['status'])!.value,
      createdBy: this.editForm.get(['createdBy'])!.value,
      createdDate: this.editForm.get(['createdDate'])!.value
        ? moment(this.editForm.get(['createdDate'])!.value, DATE_TIME_FORMAT)
        : undefined
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductHistory>>): void {
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
