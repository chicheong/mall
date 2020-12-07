import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IShipping, Shipping } from 'app/shared/model/shipping.model';
import { ShippingService } from './shipping.service';
import { ShippingComponent } from './shipping.component';
import { ShippingDetailComponent } from './shipping-detail.component';
import { ShippingUpdateComponent } from './shipping-update.component';

@Injectable({ providedIn: 'root' })
export class ShippingResolve implements Resolve<IShipping> {
  constructor(private service: ShippingService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IShipping> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((shipping: HttpResponse<Shipping>) => {
          if (shipping.body) {
            return of(shipping.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Shipping());
  }
}

export const shippingRoute: Routes = [
  {
    path: '',
    component: ShippingComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'mallApp.shipping.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: ShippingDetailComponent,
    resolve: {
      shipping: ShippingResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.shipping.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: ShippingUpdateComponent,
    resolve: {
      shipping: ShippingResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.shipping.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: ShippingUpdateComponent,
    resolve: {
      shipping: ShippingResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.shipping.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
