import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { ProductItemComponent } from './product-item.component';
import { ProductItemDetailComponent } from './product-item-detail.component';
import { ProductItemPopupComponent } from './product-item-dialog.component';
import { ProductItemDeletePopupComponent } from './product-item-delete-dialog.component';

@Injectable()
export class ProductItemResolvePagingParams implements Resolve<any> {

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

export const productItemRoute: Routes = [
    {
        path: 'product-item',
        component: ProductItemComponent,
        resolve: {
            'pagingParams': ProductItemResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productItem.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'product-item/:id',
        component: ProductItemDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productItem.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const productItemPopupRoute: Routes = [
    {
        path: 'product-item-new',
        component: ProductItemPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productItem.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'product-item/:id/edit',
        component: ProductItemPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productItem.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'product-item/:id/delete',
        component: ProductItemDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productItem.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
