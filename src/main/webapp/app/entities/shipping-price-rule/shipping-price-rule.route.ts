import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IShippingPriceRule, ShippingPriceRule } from 'app/shared/model/shipping-price-rule.model';
import { ShippingPriceRuleService } from './shipping-price-rule.service';
import { ShippingPriceRuleComponent } from './shipping-price-rule.component';
import { ShippingPriceRuleDetailComponent } from './shipping-price-rule-detail.component';
import { ShippingPriceRuleUpdateComponent } from './shipping-price-rule-update.component';

@Injectable({ providedIn: 'root' })
export class ShippingPriceRuleResolve implements Resolve<IShippingPriceRule> {
  constructor(private service: ShippingPriceRuleService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IShippingPriceRule> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((shippingPriceRule: HttpResponse<ShippingPriceRule>) => {
          if (shippingPriceRule.body) {
            return of(shippingPriceRule.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ShippingPriceRule());
  }
}

export const shippingPriceRuleRoute: Routes = [
  {
    path: '',
    component: ShippingPriceRuleComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'mallApp.shippingPriceRule.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: ShippingPriceRuleDetailComponent,
    resolve: {
      shippingPriceRule: ShippingPriceRuleResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.shippingPriceRule.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: ShippingPriceRuleUpdateComponent,
    resolve: {
      shippingPriceRule: ShippingPriceRuleResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.shippingPriceRule.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: ShippingPriceRuleUpdateComponent,
    resolve: {
      shippingPriceRule: ShippingPriceRuleResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.shippingPriceRule.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
