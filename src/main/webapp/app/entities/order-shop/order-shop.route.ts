import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IOrderShop, OrderShop } from 'app/shared/model/order-shop.model';
import { OrderShopService } from './order-shop.service';
import { OrderShopComponent } from './order-shop.component';
import { OrderShopDetailComponent } from './order-shop-detail.component';
import { OrderShopUpdateComponent } from './order-shop-update.component';

@Injectable({ providedIn: 'root' })
export class OrderShopResolve implements Resolve<IOrderShop> {
  constructor(private service: OrderShopService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOrderShop> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((orderShop: HttpResponse<OrderShop>) => {
          if (orderShop.body) {
            return of(orderShop.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new OrderShop());
  }
}

export const orderShopRoute: Routes = [
  {
    path: '',
    component: OrderShopComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'mallApp.orderShop.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: OrderShopDetailComponent,
    resolve: {
      orderShop: OrderShopResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.orderShop.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: OrderShopUpdateComponent,
    resolve: {
      orderShop: OrderShopResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.orderShop.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: OrderShopUpdateComponent,
    resolve: {
      orderShop: OrderShopResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.orderShop.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
