import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { OfficeComponent } from './office.component';
import { OfficeDetailComponent } from './office-detail.component';
import { OfficePopupComponent } from './office-dialog.component';
import { OfficeDeletePopupComponent } from './office-delete-dialog.component';

@Injectable()
export class OfficeResolvePagingParams implements Resolve<any> {

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

export const officeRoute: Routes = [
    {
        path: 'office',
        component: OfficeComponent,
        resolve: {
            'pagingParams': OfficeResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.office.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'office/:id',
        component: OfficeDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.office.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const officePopupRoute: Routes = [
    {
        path: 'office-new',
        component: OfficePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.office.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'office/:id/edit',
        component: OfficePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.office.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'office/:id/delete',
        component: OfficeDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.office.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
