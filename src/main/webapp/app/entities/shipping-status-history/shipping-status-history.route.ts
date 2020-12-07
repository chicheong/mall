import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IShippingStatusHistory, ShippingStatusHistory } from 'app/shared/model/shipping-status-history.model';
import { ShippingStatusHistoryService } from './shipping-status-history.service';
import { ShippingStatusHistoryComponent } from './shipping-status-history.component';
import { ShippingStatusHistoryDetailComponent } from './shipping-status-history-detail.component';
import { ShippingStatusHistoryUpdateComponent } from './shipping-status-history-update.component';

@Injectable({ providedIn: 'root' })
export class ShippingStatusHistoryResolve implements Resolve<IShippingStatusHistory> {
  constructor(private service: ShippingStatusHistoryService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IShippingStatusHistory> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((shippingStatusHistory: HttpResponse<ShippingStatusHistory>) => {
          if (shippingStatusHistory.body) {
            return of(shippingStatusHistory.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ShippingStatusHistory());
  }
}

export const shippingStatusHistoryRoute: Routes = [
  {
    path: '',
    component: ShippingStatusHistoryComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.shippingStatusHistory.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: ShippingStatusHistoryDetailComponent,
    resolve: {
      shippingStatusHistory: ShippingStatusHistoryResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.shippingStatusHistory.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: ShippingStatusHistoryUpdateComponent,
    resolve: {
      shippingStatusHistory: ShippingStatusHistoryResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.shippingStatusHistory.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: ShippingStatusHistoryUpdateComponent,
    resolve: {
      shippingStatusHistory: ShippingStatusHistoryResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.shippingStatusHistory.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
