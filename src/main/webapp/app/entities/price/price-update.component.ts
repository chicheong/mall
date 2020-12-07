import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IPrice, Price } from 'app/shared/model/price.model';
import { PriceService } from './price.service';
import { IProductItem } from 'app/shared/model/product-item.model';
import { ProductItemService } from 'app/entities/product-item/product-item.service';

@Component({
  selector: 'jhi-price-update',
  templateUrl: './price-update.component.html'
})
export class PriceUpdateComponent implements OnInit {
  isSaving = false;
  productitems: IProductItem[] = [];

  editForm = this.fb.group({
    id: [],
    from: [],
    to: [],
    price: [],
    currency: [],
    item: []
  });

  constructor(
    protected priceService: PriceService,
    protected productItemService: ProductItemService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ price }) => {
      if (!price.id) {
        const today = moment().startOf('day');
        price.from = today;
        price.to = today;
      }

      this.updateForm(price);

      this.productItemService.query().subscribe((res: HttpResponse<IProductItem[]>) => (this.productitems = res.body || []));
    });
  }

  updateForm(price: IPrice): void {
    this.editForm.patchValue({
      id: price.id,
      from: price.from ? price.from.format(DATE_TIME_FORMAT) : null,
      to: price.to ? price.to.format(DATE_TIME_FORMAT) : null,
      price: price.price,
      currency: price.currency,
      item: price.item
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const price = this.createFromForm();
    if (price.id !== undefined) {
      this.subscribeToSaveResponse(this.priceService.update(price));
    } else {
      this.subscribeToSaveResponse(this.priceService.create(price));
    }
  }

  private createFromForm(): IPrice {
    return {
      ...new Price(),
      id: this.editForm.get(['id'])!.value,
      from: this.editForm.get(['from'])!.value ? moment(this.editForm.get(['from'])!.value, DATE_TIME_FORMAT) : undefined,
      to: this.editForm.get(['to'])!.value ? moment(this.editForm.get(['to'])!.value, DATE_TIME_FORMAT) : undefined,
      price: this.editForm.get(['price'])!.value,
      currency: this.editForm.get(['currency'])!.value,
      item: this.editForm.get(['item'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPrice>>): void {
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
