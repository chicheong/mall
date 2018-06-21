import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { ShippingTypeComponent } from './shipping-type.component';
import { ShippingTypeDetailComponent } from './shipping-type-detail.component';
import { ShippingTypePopupComponent } from './shipping-type-dialog.component';
import { ShippingTypeDeletePopupComponent } from './shipping-type-delete-dialog.component';

@Injectable()
export class ShippingTypeResolvePagingParams implements Resolve<any> {

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

export const shippingTypeRoute: Routes = [
    {
        path: 'shipping-type',
        component: ShippingTypeComponent,
        resolve: {
            'pagingParams': ShippingTypeResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shippingType.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'shipping-type/:id',
        component: ShippingTypeDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shippingType.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const shippingTypePopupRoute: Routes = [
    {
        path: 'shipping-type-new',
        component: ShippingTypePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shippingType.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'shipping-type/:id/edit',
        component: ShippingTypePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shippingType.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'shipping-type/:id/delete',
        component: ShippingTypeDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shippingType.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
