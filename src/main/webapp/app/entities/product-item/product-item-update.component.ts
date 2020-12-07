import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IProductItem, ProductItem } from 'app/shared/model/product-item.model';
import { ProductItemService } from './product-item.service';
import { IProductStyle } from 'app/shared/model/product-style.model';
import { ProductStyleService } from 'app/entities/product-style/product-style.service';
import { IProduct } from 'app/shared/model/product.model';
import { ProductService } from 'app/entities/product/product.service';

type SelectableEntity = IProductStyle | IProduct;

@Component({
  selector: 'jhi-product-item-update',
  templateUrl: './product-item-update.component.html'
})
export class ProductItemUpdateComponent implements OnInit {
  isSaving = false;
  colors: IProductStyle[] = [];
  sizes: IProductStyle[] = [];
  products: IProduct[] = [];

  editForm = this.fb.group({
    id: [],
    code: [],
    isDefault: [],
    quantity: [],
    currency: [],
    price: [],
    color: [],
    size: [],
    product: []
  });

  constructor(
    protected productItemService: ProductItemService,
    protected productStyleService: ProductStyleService,
    protected productService: ProductService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productItem }) => {
      this.updateForm(productItem);

      this.productStyleService
        .query({ filter: 'productitem-is-null' })
        .pipe(
          map((res: HttpResponse<IProductStyle[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IProductStyle[]) => {
          if (!productItem.colorId) {
            this.colors = resBody;
          } else {
            this.productStyleService
              .find(productItem.colorId)
              .pipe(
                map((subRes: HttpResponse<IProductStyle>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IProductStyle[]) => (this.colors = concatRes));
          }
        });

      this.productStyleService
        .query({ filter: 'productitem-is-null' })
        .pipe(
          map((res: HttpResponse<IProductStyle[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IProductStyle[]) => {
          if (!productItem.sizeId) {
            this.sizes = resBody;
          } else {
            this.productStyleService
              .find(productItem.sizeId)
              .pipe(
                map((subRes: HttpResponse<IProductStyle>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IProductStyle[]) => (this.sizes = concatRes));
          }
        });

      this.productService.query().subscribe((res: HttpResponse<IProduct[]>) => (this.products = res.body || []));
    });
  }

  updateForm(productItem: IProductItem): void {
    this.editForm.patchValue({
      id: productItem.id,
      code: productItem.code,
      isDefault: productItem.isDefault,
      quantity: productItem.quantity,
      currency: productItem.currency,
      price: productItem.price,
      color: productItem.color,
      size: productItem.size,
      product: productItem.product
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const productItem = this.createFromForm();
    if (productItem.id !== undefined) {
      this.subscribeToSaveResponse(this.productItemService.update(productItem));
    } else {
      this.subscribeToSaveResponse(this.productItemService.create(productItem));
    }
  }

  private createFromForm(): IProductItem {
    return {
      ...new ProductItem(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      isDefault: this.editForm.get(['isDefault'])!.value,
      quantity: this.editForm.get(['quantity'])!.value,
      currency: this.editForm.get(['currency'])!.value,
      price: this.editForm.get(['price'])!.value,
      color: this.editForm.get(['color'])!.value,
      size: this.editForm.get(['size'])!.value,
      product: this.editForm.get(['product'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductItem>>): void {
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
