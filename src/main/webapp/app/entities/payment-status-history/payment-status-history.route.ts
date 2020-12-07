import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IPaymentStatusHistory, PaymentStatusHistory } from 'app/shared/model/payment-status-history.model';
import { PaymentStatusHistoryService } from './payment-status-history.service';
import { PaymentStatusHistoryComponent } from './payment-status-history.component';
import { PaymentStatusHistoryDetailComponent } from './payment-status-history-detail.component';
import { PaymentStatusHistoryUpdateComponent } from './payment-status-history-update.component';

@Injectable({ providedIn: 'root' })
export class PaymentStatusHistoryResolve implements Resolve<IPaymentStatusHistory> {
  constructor(private service: PaymentStatusHistoryService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPaymentStatusHistory> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((paymentStatusHistory: HttpResponse<PaymentStatusHistory>) => {
          if (paymentStatusHistory.body) {
            return of(paymentStatusHistory.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PaymentStatusHistory());
  }
}

export const paymentStatusHistoryRoute: Routes = [
  {
    path: '',
    component: PaymentStatusHistoryComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.paymentStatusHistory.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: PaymentStatusHistoryDetailComponent,
    resolve: {
      paymentStatusHistory: PaymentStatusHistoryResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.paymentStatusHistory.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: PaymentStatusHistoryUpdateComponent,
    resolve: {
      paymentStatusHistory: PaymentStatusHistoryResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.paymentStatusHistory.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: PaymentStatusHistoryUpdateComponent,
    resolve: {
      paymentStatusHistory: PaymentStatusHistoryResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.paymentStatusHistory.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
