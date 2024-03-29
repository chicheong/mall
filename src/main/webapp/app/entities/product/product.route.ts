import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IProduct, Product } from 'app/shared/model/product.model';
import { ProductService } from './product.service';
import { ProductComponent } from './product.component';
import { ProductDetailComponent } from './product-detail.component';
import { ProductUpdateComponent } from './product-update.component';

@Injectable({ providedIn: 'root' })
export class ProductResolve implements Resolve<IProduct> {
  constructor(private service: ProductService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProduct> | Observable<never> {
    const id = route.params['id'];
    if (id) {
        return this.service.find(id).pipe(
          flatMap((product: HttpResponse<Product>) => {
            if (product.body) {
              return of(product.body);
            } else {
              this.router.navigate(['404']);
              return EMPTY;
            }
          })
        );
    } else {
      const shopId = route.params['shopId'];
      if (shopId) {
        const entity: Product = Object.assign(new Product());
        entity.shopId = shopId;
        return of(entity);
      }
    }
    return of(new Product());
  }
}

export const productRoute: Routes = [
  {
    path: '',
    component: ProductComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'mallApp.product.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: ProductDetailComponent,
    resolve: {
      product: ProductResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.product.home.title'
    },
    canActivate: []
  },
  {
    path: 'new',
    component: ProductUpdateComponent,
    resolve: {
      product: ProductResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.product.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: ProductUpdateComponent,
    resolve: {
      product: ProductResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.product.home.title'
    },
    canActivate: [UserRouteAccessService]
  }, 
  {
    path: ':shopId/shop',
    component: ProductUpdateComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.product.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
