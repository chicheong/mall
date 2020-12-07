import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IShop, Shop } from 'app/shared/model/shop.model';
import { ShopService } from './shop.service';
import { ShopComponent } from './shop.component';
import { ShopDetailComponent } from './shop-detail.component';
import { ShopUpdateComponent } from './shop-update.component';

@Injectable({ providedIn: 'root' })
export class ShopResolve implements Resolve<IShop> {
  constructor(private service: ShopService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IShop> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((shop: HttpResponse<Shop>) => {
          if (shop.body) {
            return of(shop.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Shop());
  }
}

export const shopRoute: Routes = [
  {
    path: '',
    component: ShopComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'mallApp.shop.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: ShopDetailComponent,
    resolve: {
      shop: ShopResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.shop.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: ShopUpdateComponent,
    resolve: {
      shop: ShopResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.shop.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: ShopUpdateComponent,
    resolve: {
      shop: ShopResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.shop.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
