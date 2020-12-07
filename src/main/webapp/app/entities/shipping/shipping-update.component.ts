import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IShipping, Shipping } from 'app/shared/model/shipping.model';
import { ShippingService } from './shipping.service';
import { IShippingType } from 'app/shared/model/shipping-type.model';
import { ShippingTypeService } from 'app/entities/shipping-type/shipping-type.service';

@Component({
  selector: 'jhi-shipping-update',
  templateUrl: './shipping-update.component.html'
})
export class ShippingUpdateComponent implements OnInit {
  isSaving = false;
  shippingtypes: IShippingType[] = [];

  editForm = this.fb.group({
    id: [],
    price: [],
    currency: [],
    date: [],
    status: [],
    type: []
  });

  constructor(
    protected shippingService: ShippingService,
    protected shippingTypeService: ShippingTypeService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shipping }) => {
      if (!shipping.id) {
        const today = moment().startOf('day');
        shipping.date = today;
      }

      this.updateForm(shipping);

      this.shippingTypeService.query().subscribe((res: HttpResponse<IShippingType[]>) => (this.shippingtypes = res.body || []));
    });
  }

  updateForm(shipping: IShipping): void {
    this.editForm.patchValue({
      id: shipping.id,
      price: shipping.price,
      currency: shipping.currency,
      date: shipping.date ? shipping.date.format(DATE_TIME_FORMAT) : null,
      status: shipping.status,
      type: shipping.type
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const shipping = this.createFromForm();
    if (shipping.id !== undefined) {
      this.subscribeToSaveResponse(this.shippingService.update(shipping));
    } else {
      this.subscribeToSaveResponse(this.shippingService.create(shipping));
    }
  }

  private createFromForm(): IShipping {
    return {
      ...new Shipping(),
      id: this.editForm.get(['id'])!.value,
      price: this.editForm.get(['price'])!.value,
      currency: this.editForm.get(['currency'])!.value,
      date: this.editForm.get(['date'])!.value ? moment(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      status: this.editForm.get(['status'])!.value,
      type: this.editForm.get(['type'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IShipping>>): void {
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

  trackById(index: number, item: IShippingType): any {
    return item.id;
  }
}
