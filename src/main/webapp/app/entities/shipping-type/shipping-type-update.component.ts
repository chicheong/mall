import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IShippingType, ShippingType } from 'app/shared/model/shipping-type.model';
import { ShippingTypeService } from './shipping-type.service';

@Component({
  selector: 'jhi-shipping-type-update',
  templateUrl: './shipping-type-update.component.html'
})
export class ShippingTypeUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [],
    description: [],
    price: [],
    currency: []
  });

  constructor(protected shippingTypeService: ShippingTypeService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shippingType }) => {
      this.updateForm(shippingType);
    });
  }

  updateForm(shippingType: IShippingType): void {
    this.editForm.patchValue({
      id: shippingType.id,
      name: shippingType.name,
      description: shippingType.description,
      price: shippingType.price,
      currency: shippingType.currency
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const shippingType = this.createFromForm();
    if (shippingType.id !== undefined) {
      this.subscribeToSaveResponse(this.shippingTypeService.update(shippingType));
    } else {
      this.subscribeToSaveResponse(this.shippingTypeService.create(shippingType));
    }
  }

  private createFromForm(): IShippingType {
    return {
      ...new ShippingType(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      price: this.editForm.get(['price'])!.value,
      currency: this.editForm.get(['currency'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IShippingType>>): void {
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
