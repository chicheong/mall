import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { StateComponent } from './state.component';
import { StateDetailComponent } from './state-detail.component';
import { StatePopupComponent } from './state-dialog.component';
import { StateDeletePopupComponent } from './state-delete-dialog.component';

@Injectable()
export class StateResolvePagingParams implements Resolve<any> {

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

export const stateRoute: Routes = [
    {
        path: 'state',
        component: StateComponent,
        resolve: {
            'pagingParams': StateResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.state.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'state/:id',
        component: StateDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.state.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const statePopupRoute: Routes = [
    {
        path: 'state-new',
        component: StatePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.state.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'state/:id/edit',
        component: StatePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.state.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'state/:id/delete',
        component: StateDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.state.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
