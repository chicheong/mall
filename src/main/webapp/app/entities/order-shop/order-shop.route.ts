import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { OrderShopComponent } from './order-shop.component';
import { OrderShopDetailComponent } from './order-shop-detail.component';
import { OrderShopPopupComponent } from './order-shop-dialog.component';
import { OrderShopDeletePopupComponent } from './order-shop-delete-dialog.component';

@Injectable()
export class OrderShopResolvePagingParams implements Resolve<any> {

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

export const orderShopRoute: Routes = [
    {
        path: 'order-shop',
        component: OrderShopComponent,
        resolve: {
            'pagingParams': OrderShopResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.orderShop.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'order-shop/:id',
        component: OrderShopDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.orderShop.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const orderShopPopupRoute: Routes = [
    {
        path: 'order-shop-new',
        component: OrderShopPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.orderShop.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'order-shop/:id/edit',
        component: OrderShopPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.orderShop.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'order-shop/:id/delete',
        component: OrderShopDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.orderShop.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
