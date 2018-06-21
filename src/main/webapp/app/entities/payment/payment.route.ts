import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { PaymentComponent } from './payment.component';
import { PaymentDetailComponent } from './payment-detail.component';
import { PaymentPopupComponent } from './payment-dialog.component';
import { PaymentDeletePopupComponent } from './payment-delete-dialog.component';

@Injectable()
export class PaymentResolvePagingParams implements Resolve<any> {

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

export const paymentRoute: Routes = [
    {
        path: 'payment',
        component: PaymentComponent,
        resolve: {
            'pagingParams': PaymentResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.payment.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'payment/:id',
        component: PaymentDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.payment.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const paymentPopupRoute: Routes = [
    {
        path: 'payment-new',
        component: PaymentPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.payment.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'payment/:id/edit',
        component: PaymentPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.payment.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'payment/:id/delete',
        component: PaymentDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.payment.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
