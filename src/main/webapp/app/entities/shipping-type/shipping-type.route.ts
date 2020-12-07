import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IShippingType, ShippingType } from 'app/shared/model/shipping-type.model';
import { ShippingTypeService } from './shipping-type.service';
import { ShippingTypeComponent } from './shipping-type.component';
import { ShippingTypeDetailComponent } from './shipping-type-detail.component';
import { ShippingTypeUpdateComponent } from './shipping-type-update.component';

@Injectable({ providedIn: 'root' })
export class ShippingTypeResolve implements Resolve<IShippingType> {
  constructor(private service: ShippingTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IShippingType> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((shippingType: HttpResponse<ShippingType>) => {
          if (shippingType.body) {
            return of(shippingType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ShippingType());
  }
}

export const shippingTypeRoute: Routes = [
  {
    path: '',
    component: ShippingTypeComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'mallApp.shippingType.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: ShippingTypeDetailComponent,
    resolve: {
      shippingType: ShippingTypeResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.shippingType.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: ShippingTypeUpdateComponent,
    resolve: {
      shippingType: ShippingTypeResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.shippingType.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: ShippingTypeUpdateComponent,
    resolve: {
      shippingType: ShippingTypeResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.shippingType.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
