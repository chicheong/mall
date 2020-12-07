import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProductItem } from 'app/shared/model/product-item.model';

@Component({
  selector: 'jhi-product-item-detail',
  templateUrl: './product-item-detail.component.html'
})
export class ProductItemDetailComponent implements OnInit {
  productItem: IProductItem | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productItem }) => (this.productItem = productItem));
  }

  previousState(): void {
    window.history.back();
  }
}
