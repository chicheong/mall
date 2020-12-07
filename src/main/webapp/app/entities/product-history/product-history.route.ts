import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IProductHistory, ProductHistory } from 'app/shared/model/product-history.model';
import { ProductHistoryService } from './product-history.service';
import { ProductHistoryComponent } from './product-history.component';
import { ProductHistoryDetailComponent } from './product-history-detail.component';
import { ProductHistoryUpdateComponent } from './product-history-update.component';

@Injectable({ providedIn: 'root' })
export class ProductHistoryResolve implements Resolve<IProductHistory> {
  constructor(private service: ProductHistoryService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProductHistory> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((productHistory: HttpResponse<ProductHistory>) => {
          if (productHistory.body) {
            return of(productHistory.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ProductHistory());
  }
}

export const productHistoryRoute: Routes = [
  {
    path: '',
    component: ProductHistoryComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.productHistory.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: ProductHistoryDetailComponent,
    resolve: {
      productHistory: ProductHistoryResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.productHistory.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: ProductHistoryUpdateComponent,
    resolve: {
      productHistory: ProductHistoryResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.productHistory.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: ProductHistoryUpdateComponent,
    resolve: {
      productHistory: ProductHistoryResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.productHistory.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
