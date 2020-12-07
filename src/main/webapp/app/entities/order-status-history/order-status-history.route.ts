import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IOrderStatusHistory, OrderStatusHistory } from 'app/shared/model/order-status-history.model';
import { OrderStatusHistoryService } from './order-status-history.service';
import { OrderStatusHistoryComponent } from './order-status-history.component';
import { OrderStatusHistoryDetailComponent } from './order-status-history-detail.component';
import { OrderStatusHistoryUpdateComponent } from './order-status-history-update.component';

@Injectable({ providedIn: 'root' })
export class OrderStatusHistoryResolve implements Resolve<IOrderStatusHistory> {
  constructor(private service: OrderStatusHistoryService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOrderStatusHistory> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((orderStatusHistory: HttpResponse<OrderStatusHistory>) => {
          if (orderStatusHistory.body) {
            return of(orderStatusHistory.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new OrderStatusHistory());
  }
}

export const orderStatusHistoryRoute: Routes = [
  {
    path: '',
    component: OrderStatusHistoryComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.orderStatusHistory.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: OrderStatusHistoryDetailComponent,
    resolve: {
      orderStatusHistory: OrderStatusHistoryResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.orderStatusHistory.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: OrderStatusHistoryUpdateComponent,
    resolve: {
      orderStatusHistory: OrderStatusHistoryResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.orderStatusHistory.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: OrderStatusHistoryUpdateComponent,
    resolve: {
      orderStatusHistory: OrderStatusHistoryResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.orderStatusHistory.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
