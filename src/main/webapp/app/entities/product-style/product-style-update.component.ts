import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IProductStyle, ProductStyle } from 'app/shared/model/product-style.model';
import { ProductStyleService } from './product-style.service';
import { IProduct } from 'app/shared/model/product.model';
import { ProductService } from 'app/entities/product/product.service';

@Component({
  selector: 'jhi-product-style-update',
  templateUrl: './product-style-update.component.html'
})
export class ProductStyleUpdateComponent implements OnInit {
  isSaving = false;
  products: IProduct[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    code: [],
    isDefault: [],
    type: [],
    product: []
  });

  constructor(
    protected productStyleService: ProductStyleService,
    protected productService: ProductService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productStyle }) => {
      this.updateForm(productStyle);

      this.productService.query().subscribe((res: HttpResponse<IProduct[]>) => (this.products = res.body || []));
    });
  }

  updateForm(productStyle: IProductStyle): void {
    this.editForm.patchValue({
      id: productStyle.id,
      name: productStyle.name,
      code: productStyle.code,
      isDefault: productStyle.isDefault,
      type: productStyle.type,
      product: productStyle.product
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const productStyle = this.createFromForm();
    if (productStyle.id !== undefined) {
      this.subscribeToSaveResponse(this.productStyleService.update(productStyle));
    } else {
      this.subscribeToSaveResponse(this.productStyleService.create(productStyle));
    }
  }

  private createFromForm(): IProductStyle {
    return {
      ...new ProductStyle(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      code: this.editForm.get(['code'])!.value,
      isDefault: this.editForm.get(['isDefault'])!.value,
      type: this.editForm.get(['type'])!.value,
      product: this.editForm.get(['product'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductStyle>>): void {
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

  trackById(index: number, item: IProduct): any {
    return item.id;
  }
}
