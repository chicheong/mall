import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { MyAccountComponent } from './my-account.component';
import { MyAccountDetailComponent } from './my-account-detail.component';
import { MyAccountPopupComponent } from './my-account-dialog.component';
import { MyAccountDeletePopupComponent } from './my-account-delete-dialog.component';

@Injectable()
export class MyAccountResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: JhiPaginationUtil) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
        const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,asc';
        return {
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort)
      };
    }
}

export const myAccountRoute: Routes = [
    {
        path: 'my-account',
        component: MyAccountComponent,
        resolve: {
            'pagingParams': MyAccountResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.myAccount.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'my-account/:id',
        component: MyAccountDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.myAccount.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const myAccountPopupRoute: Routes = [
    {
        path: 'my-account-new',
        component: MyAccountPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.myAccount.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'my-account/:id/edit',
        component: MyAccountPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.myAccount.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'my-account/:id/delete',
        component: MyAccountDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.myAccount.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
