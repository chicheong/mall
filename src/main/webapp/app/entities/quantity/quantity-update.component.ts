import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IQuantity, Quantity } from 'app/shared/model/quantity.model';
import { QuantityService } from './quantity.service';
import { IProductItem } from 'app/shared/model/product-item.model';
import { ProductItemService } from 'app/entities/product-item/product-item.service';

@Component({
  selector: 'jhi-quantity-update',
  templateUrl: './quantity-update.component.html'
})
export class QuantityUpdateComponent implements OnInit {
  isSaving = false;
  productitems: IProductItem[] = [];

  editForm = this.fb.group({
    id: [],
    from: [],
    to: [],
    quantity: [],
    item: []
  });

  constructor(
    protected quantityService: QuantityService,
    protected productItemService: ProductItemService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ quantity }) => {
      if (!quantity.id) {
        const today = moment().startOf('day');
        quantity.from = today;
        quantity.to = today;
      }

      this.updateForm(quantity);

      this.productItemService.query().subscribe((res: HttpResponse<IProductItem[]>) => (this.productitems = res.body || []));
    });
  }

  updateForm(quantity: IQuantity): void {
    this.editForm.patchValue({
      id: quantity.id,
      from: quantity.from ? quantity.from.format(DATE_TIME_FORMAT) : null,
      to: quantity.to ? quantity.to.format(DATE_TIME_FORMAT) : null,
      quantity: quantity.quantity,
      item: quantity.item
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const quantity = this.createFromForm();
    if (quantity.id !== undefined) {
      this.subscribeToSaveResponse(this.quantityService.update(quantity));
    } else {
      this.subscribeToSaveResponse(this.quantityService.create(quantity));
    }
  }

  private createFromForm(): IQuantity {
    return {
      ...new Quantity(),
      id: this.editForm.get(['id'])!.value,
      from: this.editForm.get(['from'])!.value ? moment(this.editForm.get(['from'])!.value, DATE_TIME_FORMAT) : undefined,
      to: this.editForm.get(['to'])!.value ? moment(this.editForm.get(['to'])!.value, DATE_TIME_FORMAT) : undefined,
      quantity: this.editForm.get(['quantity'])!.value,
      item: this.editForm.get(['item'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IQuantity>>): void {
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

  trackById(index: number, item: IProductItem): any {
    return item.id;
  }
}
