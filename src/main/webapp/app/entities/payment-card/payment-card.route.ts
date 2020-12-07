import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IPaymentCard, PaymentCard } from 'app/shared/model/payment-card.model';
import { PaymentCardService } from './payment-card.service';
import { PaymentCardComponent } from './payment-card.component';
import { PaymentCardDetailComponent } from './payment-card-detail.component';
import { PaymentCardUpdateComponent } from './payment-card-update.component';

@Injectable({ providedIn: 'root' })
export class PaymentCardResolve implements Resolve<IPaymentCard> {
  constructor(private service: PaymentCardService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPaymentCard> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((paymentCard: HttpResponse<PaymentCard>) => {
          if (paymentCard.body) {
            return of(paymentCard.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PaymentCard());
  }
}

export const paymentCardRoute: Routes = [
  {
    path: '',
    component: PaymentCardComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'mallApp.paymentCard.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: PaymentCardDetailComponent,
    resolve: {
      paymentCard: PaymentCardResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.paymentCard.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: PaymentCardUpdateComponent,
    resolve: {
      paymentCard: PaymentCardResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.paymentCard.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: PaymentCardUpdateComponent,
    resolve: {
      paymentCard: PaymentCardResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.paymentCard.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
