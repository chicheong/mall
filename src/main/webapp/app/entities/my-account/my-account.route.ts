import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IMyAccount, MyAccount } from 'app/shared/model/my-account.model';
import { MyAccountService } from './my-account.service';
import { MyAccountComponent } from './my-account.component';
import { MyAccountDetailComponent } from './my-account-detail.component';
import { MyAccountUpdateComponent } from './my-account-update.component';

@Injectable({ providedIn: 'root' })
export class MyAccountResolve implements Resolve<IMyAccount> {
  constructor(private service: MyAccountService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMyAccount> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((myAccount: HttpResponse<MyAccount>) => {
          if (myAccount.body) {
            return of(myAccount.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new MyAccount());
  }
}

export const myAccountRoute: Routes = [
  {
    path: '',
    component: MyAccountComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'mallApp.myAccount.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: MyAccountDetailComponent,
    resolve: {
      myAccount: MyAccountResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.myAccount.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: MyAccountUpdateComponent,
    resolve: {
      myAccount: MyAccountResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.myAccount.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: MyAccountUpdateComponent,
    resolve: {
      myAccount: MyAccountResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.myAccount.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
