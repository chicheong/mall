import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IShippingPriceRule, ShippingPriceRule } from 'app/shared/model/shipping-price-rule.model';
import { ShippingPriceRuleService } from './shipping-price-rule.service';
import { IShop } from 'app/shared/model/shop.model';
import { ShopService } from 'app/entities/shop/shop.service';

@Component({
  selector: 'jhi-shipping-price-rule-update',
  templateUrl: './shipping-price-rule-update.component.html'
})
export class ShippingPriceRuleUpdateComponent implements OnInit {
  isSaving = false;
  shops: IShop[] = [];

  editForm = this.fb.group({
    id: [],
    type: [],
    value: [],
    price: [],
    sequence: [],
    shop: []
  });

  constructor(
    protected shippingPriceRuleService: ShippingPriceRuleService,
    protected shopService: ShopService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shippingPriceRule }) => {
      this.updateForm(shippingPriceRule);

      this.shopService.query().subscribe((res: HttpResponse<IShop[]>) => (this.shops = res.body || []));
    });
  }

  updateForm(shippingPriceRule: IShippingPriceRule): void {
    this.editForm.patchValue({
      id: shippingPriceRule.id,
      type: shippingPriceRule.type,
      value: shippingPriceRule.value,
      price: shippingPriceRule.price,
      sequence: shippingPriceRule.sequence,
      shop: shippingPriceRule.shop
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const shippingPriceRule = this.createFromForm();
    if (shippingPriceRule.id !== undefined) {
      this.subscribeToSaveResponse(this.shippingPriceRuleService.update(shippingPriceRule));
    } else {
      this.subscribeToSaveResponse(this.shippingPriceRuleService.create(shippingPriceRule));
    }
  }

  private createFromForm(): IShippingPriceRule {
    return {
      ...new ShippingPriceRule(),
      id: this.editForm.get(['id'])!.value,
      type: this.editForm.get(['type'])!.value,
      value: this.editForm.get(['value'])!.value,
      price: this.editForm.get(['price'])!.value,
      sequence: this.editForm.get(['sequence'])!.value,
      shop: this.editForm.get(['shop'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IShippingPriceRule>>): void {
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

  trackById(index: number, item: IShop): any {
    return item.id;
  }
}
