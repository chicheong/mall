import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ICurrencyRate, CurrencyRate } from 'app/shared/model/currency-rate.model';
import { CurrencyRateService } from './currency-rate.service';
import { CurrencyRateComponent } from './currency-rate.component';
import { CurrencyRateDetailComponent } from './currency-rate-detail.component';
import { CurrencyRateUpdateComponent } from './currency-rate-update.component';

@Injectable({ providedIn: 'root' })
export class CurrencyRateResolve implements Resolve<ICurrencyRate> {
  constructor(private service: CurrencyRateService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICurrencyRate> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((currencyRate: HttpResponse<CurrencyRate>) => {
          if (currencyRate.body) {
            return of(currencyRate.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new CurrencyRate());
  }
}

export const currencyRateRoute: Routes = [
  {
    path: '',
    component: CurrencyRateComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.currencyRate.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: CurrencyRateDetailComponent,
    resolve: {
      currencyRate: CurrencyRateResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.currencyRate.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: CurrencyRateUpdateComponent,
    resolve: {
      currencyRate: CurrencyRateResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.currencyRate.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: CurrencyRateUpdateComponent,
    resolve: {
      currencyRate: CurrencyRateResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.currencyRate.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
