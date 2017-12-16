import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { PriceComponent } from './price.component';
import { PriceDetailComponent } from './price-detail.component';
import { PricePopupComponent } from './price-dialog.component';
import { PriceDeletePopupComponent } from './price-delete-dialog.component';

@Injectable()
export class PriceResolvePagingParams implements Resolve<any> {

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

export const priceRoute: Routes = [
    {
        path: 'price',
        component: PriceComponent,
        resolve: {
            'pagingParams': PriceResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.price.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'price/:id',
        component: PriceDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.price.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const pricePopupRoute: Routes = [
    {
        path: 'price-new',
        component: PricePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.price.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'price/:id/edit',
        component: PricePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.price.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'price/:id/delete',
        component: PriceDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.price.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
