import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IMyUrl, MyUrl } from 'app/shared/model/my-url.model';
import { MyUrlService } from './my-url.service';
import { MyUrlComponent } from './my-url.component';
import { MyUrlDetailComponent } from './my-url-detail.component';
import { MyUrlUpdateComponent } from './my-url-update.component';

@Injectable({ providedIn: 'root' })
export class MyUrlResolve implements Resolve<IMyUrl> {
  constructor(private service: MyUrlService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMyUrl> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((url: HttpResponse<MyUrl>) => {
          if (url.body) {
            return of(url.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new MyUrl());
  }
}

export const urlRoute: Routes = [
  {
    path: '',
    component: MyUrlComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'mallApp.url.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: MyUrlDetailComponent,
    resolve: {
      url: MyUrlResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.url.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: MyUrlUpdateComponent,
    resolve: {
      url: MyUrlResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.url.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: MyUrlUpdateComponent,
    resolve: {
      url: MyUrlResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.url.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
