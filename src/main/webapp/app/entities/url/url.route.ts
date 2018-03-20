import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { UrlComponent } from './url.component';
import { UrlDetailComponent } from './url-detail.component';
import { UrlPopupComponent } from './url-dialog.component';
import { UrlDeletePopupComponent } from './url-delete-dialog.component';

@Injectable()
export class UrlResolvePagingParams implements Resolve<any> {

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

export const urlRoute: Routes = [
    {
        path: 'url',
        component: UrlComponent,
        resolve: {
            'pagingParams': UrlResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.url.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'url/:id',
        component: UrlDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.url.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const urlPopupRoute: Routes = [
    {
        path: 'url-new',
        component: UrlPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.url.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'url/:id/edit',
        component: UrlPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.url.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'url/:id/delete',
        component: UrlDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.url.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
