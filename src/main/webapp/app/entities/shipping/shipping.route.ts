import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { ShippingComponent } from './shipping.component';
import { ShippingDetailComponent } from './shipping-detail.component';
import { ShippingPopupComponent } from './shipping-dialog.component';
import { ShippingDeletePopupComponent } from './shipping-delete-dialog.component';

@Injectable()
export class ShippingResolvePagingParams implements Resolve<any> {

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

export const shippingRoute: Routes = [
    {
        path: 'shipping',
        component: ShippingComponent,
        resolve: {
            'pagingParams': ShippingResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shipping.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'shipping/:id',
        component: ShippingDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shipping.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const shippingPopupRoute: Routes = [
    {
        path: 'shipping-new',
        component: ShippingPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shipping.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'shipping/:id/edit',
        component: ShippingPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shipping.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'shipping/:id/delete',
        component: ShippingDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shipping.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
