import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IUserInfo, UserInfo } from 'app/shared/model/user-info.model';
import { UserInfoService } from './user-info.service';
import { UserInfoComponent } from './user-info.component';
import { UserInfoDetailComponent } from './user-info-detail.component';
import { UserInfoUpdateComponent } from './user-info-update.component';

@Injectable({ providedIn: 'root' })
export class UserInfoResolve implements Resolve<IUserInfo> {
  constructor(private service: UserInfoService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserInfo> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((userInfo: HttpResponse<UserInfo>) => {
          if (userInfo.body) {
            return of(userInfo.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new UserInfo());
  }
}

export const userInfoRoute: Routes = [
  {
    path: '',
    component: UserInfoComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'mallApp.userInfo.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: UserInfoDetailComponent,
    resolve: {
      userInfo: UserInfoResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.userInfo.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: UserInfoUpdateComponent,
    resolve: {
      userInfo: UserInfoResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.userInfo.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: UserInfoUpdateComponent,
    resolve: {
      userInfo: UserInfoResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.userInfo.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
