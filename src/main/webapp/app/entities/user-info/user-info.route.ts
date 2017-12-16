import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { UserInfoComponent } from './user-info.component';
import { UserInfoDetailComponent } from './user-info-detail.component';
import { UserInfoPopupComponent } from './user-info-dialog.component';
import { UserInfoDeletePopupComponent } from './user-info-delete-dialog.component';

@Injectable()
export class UserInfoResolvePagingParams implements Resolve<any> {

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

export const userInfoRoute: Routes = [
    {
        path: 'user-info',
        component: UserInfoComponent,
        resolve: {
            'pagingParams': UserInfoResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.userInfo.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'user-info/:id',
        component: UserInfoDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.userInfo.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const userInfoPopupRoute: Routes = [
    {
        path: 'user-info-new',
        component: UserInfoPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.userInfo.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'user-info/:id/edit',
        component: UserInfoPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.userInfo.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'user-info/:id/delete',
        component: UserInfoDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.userInfo.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
