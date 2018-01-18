import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { QuantityComponent } from './quantity.component';
import { QuantityDetailComponent } from './quantity-detail.component';
import { QuantityPopupComponent } from './quantity-dialog.component';
import { QuantityDeletePopupComponent } from './quantity-delete-dialog.component';

@Injectable()
export class QuantityResolvePagingParams implements Resolve<any> {

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

export const quantityRoute: Routes = [
    {
        path: 'quantity',
        component: QuantityComponent,
        resolve: {
            'pagingParams': QuantityResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.quantity.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'quantity/:id',
        component: QuantityDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.quantity.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const quantityPopupRoute: Routes = [
    {
        path: 'quantity-new',
        component: QuantityPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.quantity.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'quantity/:id/edit',
        component: QuantityPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.quantity.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'quantity/:id/delete',
        component: QuantityDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.quantity.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
