import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IProductItem, ProductItem } from 'app/shared/model/product-item.model';
import { ProductItemService } from './product-item.service';
import { ProductItemComponent } from './product-item.component';
import { ProductItemDetailComponent } from './product-item-detail.component';
import { ProductItemUpdateComponent } from './product-item-update.component';

@Injectable({ providedIn: 'root' })
export class ProductItemResolve implements Resolve<IProductItem> {
  constructor(private service: ProductItemService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProductItem> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((productItem: HttpResponse<ProductItem>) => {
          if (productItem.body) {
            return of(productItem.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ProductItem());
  }
}

export const productItemRoute: Routes = [
  {
    path: '',
    component: ProductItemComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'mallApp.productItem.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: ProductItemDetailComponent,
    resolve: {
      productItem: ProductItemResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.productItem.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: ProductItemUpdateComponent,
    resolve: {
      productItem: ProductItemResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.productItem.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: ProductItemUpdateComponent,
    resolve: {
      productItem: ProductItemResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.productItem.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
