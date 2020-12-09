import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IMyOrder, MyOrder } from 'app/shared/model/my-order.model';
import { MyOrderService } from './my-order.service';
import { MyOrderComponent } from './my-order.component';
import { MyOrderDetailComponent } from './my-order-detail.component';
import { MyOrderUpdateComponent } from './my-order-update.component';
import { CartPendingComponent } from './cart/cart-pending.component';
import { CheckoutComponent } from './checkout.component';

@Injectable({ providedIn: 'root' })
export class MyOrderResolve implements Resolve<IMyOrder> {
  constructor(private service: MyOrderService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMyOrder> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((myOrder: HttpResponse<MyOrder>) => {
          if (myOrder.body) {
            return of(myOrder.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new MyOrder());
  }
}

export const myOrderRoute: Routes = [
  {
    path: '',
    component: MyOrderComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'mallApp.myOrder.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: MyOrderDetailComponent,
    resolve: {
      myOrder: MyOrderResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.myOrder.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: MyOrderUpdateComponent,
    resolve: {
      myOrder: MyOrderResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.myOrder.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: MyOrderUpdateComponent,
    resolve: {
      myOrder: MyOrderResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.myOrder.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
      path: ':id/pending',
      component: CartPendingComponent,
      resolve: {
          myOrder: MyOrderResolve
      },
      data: {
          authorities: [Authority.USER],
          pageTitle: 'mallApp.myOrder.cart.pending.title'
      },
      canActivate: [UserRouteAccessService]
  },
  {
      path: ':id/checkout',
      component: CheckoutComponent,
      resolve: {
          myOrder: MyOrderResolve
      },
      data: {
          authorities: [Authority.USER],
          pageTitle: 'mallApp.myOrder.cart.review.title'
      },
      canActivate: [UserRouteAccessService]
  },
  {
      path: ':id/review',
      component: MyOrderDetailComponent,
      resolve: {
          myOrder: MyOrderResolve
      },
      data: {
          authorities: [Authority.USER],
          pageTitle: 'mallApp.myOrder.cart.review.title'
      },
      canActivate: [UserRouteAccessService]
  },
  {
      path: ':id/shipping',
      component: MyOrderDetailComponent,
      resolve: {
          myOrder: MyOrderResolve
      },
      data: {
          authorities: [Authority.USER],
          pageTitle: 'mallApp.myOrder.cart.shipping.title'
      },
      canActivate: [UserRouteAccessService]
  },
  {
      path: ':id/method',
      component: MyOrderDetailComponent,
      resolve: {
          myOrder: MyOrderResolve
      },
      data: {
          authorities: [Authority.USER],
          pageTitle: 'mallApp.myOrder.cart.method.title'
      },
      canActivate: [UserRouteAccessService]
  },
  {
      path: ':id/billing',
      component: MyOrderDetailComponent,
      resolve: {
          myOrder: MyOrderResolve
      },
      data: {
          authorities: [Authority.USER],
          pageTitle: 'mallApp.myOrder.cart.billing.title'
      },
      canActivate: [UserRouteAccessService]
  },
  {
      path: ':id/payment',
      component: MyOrderDetailComponent,
      resolve: {
          myOrder: MyOrderResolve
      },
      data: {
          authorities: [Authority.USER],
          pageTitle: 'mallApp.myOrder.cart.payment.title'
      },
      canActivate: [UserRouteAccessService]
  },
  {
      path: ':id/confirmation',
      component: MyOrderDetailComponent,
      resolve: {
          myOrder: MyOrderResolve
      },
      data: {
          authorities: [Authority.USER],
          pageTitle: 'mallApp.myOrder.cart.confirmation.title'
      },
      canActivate: [UserRouteAccessService]
  }
];
