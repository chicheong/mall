import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IOrderItem, OrderItem } from 'app/shared/model/order-item.model';
import { OrderItemService } from './order-item.service';
import { IProductItem } from 'app/shared/model/product-item.model';
import { ProductItemService } from 'app/entities/product-item/product-item.service';
import { IOrderShop } from 'app/shared/model/order-shop.model';
import { OrderShopService } from 'app/entities/order-shop/order-shop.service';

type SelectableEntity = IProductItem | IOrderShop;

@Component({
  selector: 'jhi-order-item-update',
  templateUrl: './order-item-update.component.html'
})
export class OrderItemUpdateComponent implements OnInit {
  isSaving = false;
  productitems: IProductItem[] = [];
  ordershops: IOrderShop[] = [];

  editForm = this.fb.group({
    id: [],
    quantity: [],
    price: [],
    currency: [],
    productItem: [],
    shop: []
  });

  constructor(
    protected orderItemService: OrderItemService,
    protected productItemService: ProductItemService,
    protected orderShopService: OrderShopService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ orderItem }) => {
      this.updateForm(orderItem);

      this.productItemService
        .query({ filter: 'orderitem-is-null' })
        .pipe(
          map((res: HttpResponse<IProductItem[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IProductItem[]) => {
          if (!orderItem.productItemId) {
            this.productitems = resBody;
          } else {
            this.productItemService
              .find(orderItem.productItemId)
              .pipe(
                map((subRes: HttpResponse<IProductItem>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IProductItem[]) => (this.productitems = concatRes));
          }
        });

      this.orderShopService.query().subscribe((res: HttpResponse<IOrderShop[]>) => (this.ordershops = res.body || []));
    });
  }

  updateForm(orderItem: IOrderItem): void {
    this.editForm.patchValue({
      id: orderItem.id,
      quantity: orderItem.quantity,
      price: orderItem.price,
      currency: orderItem.currency,
      productItem: orderItem.productItem,
      shop: orderItem.shop
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const orderItem = this.createFromForm();
    if (orderItem.id !== undefined) {
      this.subscribeToSaveResponse(this.orderItemService.update(orderItem));
    } else {
      this.subscribeToSaveResponse(this.orderItemService.create(orderItem));
    }
  }

  private createFromForm(): IOrderItem {
    return {
      ...new OrderItem(),
      id: this.editForm.get(['id'])!.value,
      quantity: this.editForm.get(['quantity'])!.value,
      price: this.editForm.get(['price'])!.value,
      currency: this.editForm.get(['currency'])!.value,
      productItem: this.editForm.get(['productItem'])!.value,
      shop: this.editForm.get(['shop'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrderItem>>): void {
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

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }
}
