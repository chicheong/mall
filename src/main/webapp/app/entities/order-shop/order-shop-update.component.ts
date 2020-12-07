import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IOrderShop, OrderShop } from 'app/shared/model/order-shop.model';
import { OrderShopService } from './order-shop.service';
import { IShipping } from 'app/shared/model/shipping.model';
import { ShippingService } from 'app/entities/shipping/shipping.service';
import { IShop } from 'app/shared/model/shop.model';
import { ShopService } from 'app/entities/shop/shop.service';
import { IMyOrder } from 'app/shared/model/my-order.model';
import { MyOrderService } from 'app/entities/my-order/my-order.service';

type SelectableEntity = IShipping | IShop | IMyOrder;

@Component({
  selector: 'jhi-order-shop-update',
  templateUrl: './order-shop-update.component.html'
})
export class OrderShopUpdateComponent implements OnInit {
  isSaving = false;
  shippings: IShipping[] = [];
  shops: IShop[] = [];
  myorders: IMyOrder[] = [];

  editForm = this.fb.group({
    id: [],
    total: [],
    currency: [],
    remark: [],
    shipping: [],
    shop: [],
    order: []
  });

  constructor(
    protected orderShopService: OrderShopService,
    protected shippingService: ShippingService,
    protected shopService: ShopService,
    protected myOrderService: MyOrderService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ orderShop }) => {
      this.updateForm(orderShop);

      this.shippingService
        .query({ filter: 'ordershop-is-null' })
        .pipe(
          map((res: HttpResponse<IShipping[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IShipping[]) => {
          if (!orderShop.shippingId) {
            this.shippings = resBody;
          } else {
            this.shippingService
              .find(orderShop.shippingId)
              .pipe(
                map((subRes: HttpResponse<IShipping>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IShipping[]) => (this.shippings = concatRes));
          }
        });

      this.shopService
        .query({ filter: 'ordershop-is-null' })
        .pipe(
          map((res: HttpResponse<IShop[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IShop[]) => {
          if (!orderShop.shopId) {
            this.shops = resBody;
          } else {
            this.shopService
              .find(orderShop.shopId)
              .pipe(
                map((subRes: HttpResponse<IShop>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IShop[]) => (this.shops = concatRes));
          }
        });

      this.myOrderService.query().subscribe((res: HttpResponse<IMyOrder[]>) => (this.myorders = res.body || []));
    });
  }

  updateForm(orderShop: IOrderShop): void {
    this.editForm.patchValue({
      id: orderShop.id,
      total: orderShop.total,
      currency: orderShop.currency,
      remark: orderShop.remark,
      shipping: orderShop.shipping,
      shop: orderShop.shop,
      order: orderShop.order
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const orderShop = this.createFromForm();
    if (orderShop.id !== undefined) {
      this.subscribeToSaveResponse(this.orderShopService.update(orderShop));
    } else {
      this.subscribeToSaveResponse(this.orderShopService.create(orderShop));
    }
  }

  private createFromForm(): IOrderShop {
    return {
      ...new OrderShop(),
      id: this.editForm.get(['id'])!.value,
      total: this.editForm.get(['total'])!.value,
      currency: this.editForm.get(['currency'])!.value,
      remark: this.editForm.get(['remark'])!.value,
      shipping: this.editForm.get(['shipping'])!.value,
      shop: this.editForm.get(['shop'])!.value,
      order: this.editForm.get(['order'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrderShop>>): void {
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
