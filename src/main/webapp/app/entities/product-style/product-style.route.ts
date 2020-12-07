import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IProductStyle, ProductStyle } from 'app/shared/model/product-style.model';
import { ProductStyleService } from './product-style.service';
import { ProductStyleComponent } from './product-style.component';
import { ProductStyleDetailComponent } from './product-style-detail.component';
import { ProductStyleUpdateComponent } from './product-style-update.component';

@Injectable({ providedIn: 'root' })
export class ProductStyleResolve implements Resolve<IProductStyle> {
  constructor(private service: ProductStyleService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProductStyle> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((productStyle: HttpResponse<ProductStyle>) => {
          if (productStyle.body) {
            return of(productStyle.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ProductStyle());
  }
}

export const productStyleRoute: Routes = [
  {
    path: '',
    component: ProductStyleComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.productStyle.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: ProductStyleDetailComponent,
    resolve: {
      productStyle: ProductStyleResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.productStyle.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: ProductStyleUpdateComponent,
    resolve: {
      productStyle: ProductStyleResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.productStyle.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: ProductStyleUpdateComponent,
    resolve: {
      productStyle: ProductStyleResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.productStyle.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
