import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IQuantity, Quantity } from 'app/shared/model/quantity.model';
import { QuantityService } from './quantity.service';
import { QuantityComponent } from './quantity.component';
import { QuantityDetailComponent } from './quantity-detail.component';
import { QuantityUpdateComponent } from './quantity-update.component';

@Injectable({ providedIn: 'root' })
export class QuantityResolve implements Resolve<IQuantity> {
  constructor(private service: QuantityService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IQuantity> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((quantity: HttpResponse<Quantity>) => {
          if (quantity.body) {
            return of(quantity.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Quantity());
  }
}

export const quantityRoute: Routes = [
  {
    path: '',
    component: QuantityComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'mallApp.quantity.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: QuantityDetailComponent,
    resolve: {
      quantity: QuantityResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.quantity.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: QuantityUpdateComponent,
    resolve: {
      quantity: QuantityResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.quantity.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: QuantityUpdateComponent,
    resolve: {
      quantity: QuantityResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.quantity.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
