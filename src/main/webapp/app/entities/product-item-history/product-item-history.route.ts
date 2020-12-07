import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IProductItemHistory, ProductItemHistory } from 'app/shared/model/product-item-history.model';
import { ProductItemHistoryService } from './product-item-history.service';
import { ProductItemHistoryComponent } from './product-item-history.component';
import { ProductItemHistoryDetailComponent } from './product-item-history-detail.component';
import { ProductItemHistoryUpdateComponent } from './product-item-history-update.component';

@Injectable({ providedIn: 'root' })
export class ProductItemHistoryResolve implements Resolve<IProductItemHistory> {
  constructor(private service: ProductItemHistoryService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProductItemHistory> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((productItemHistory: HttpResponse<ProductItemHistory>) => {
          if (productItemHistory.body) {
            return of(productItemHistory.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ProductItemHistory());
  }
}

export const productItemHistoryRoute: Routes = [
  {
    path: '',
    component: ProductItemHistoryComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.productItemHistory.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: ProductItemHistoryDetailComponent,
    resolve: {
      productItemHistory: ProductItemHistoryResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.productItemHistory.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: ProductItemHistoryUpdateComponent,
    resolve: {
      productItemHistory: ProductItemHistoryResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.productItemHistory.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: ProductItemHistoryUpdateComponent,
    resolve: {
      productItemHistory: ProductItemHistoryResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.productItemHistory.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
