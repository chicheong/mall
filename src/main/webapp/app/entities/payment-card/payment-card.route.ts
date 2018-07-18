import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { PaymentCardComponent } from './payment-card.component';
import { PaymentCardDetailComponent } from './payment-card-detail.component';
import { PaymentCardPopupComponent } from './payment-card-dialog.component';
import { PaymentCardDeletePopupComponent } from './payment-card-delete-dialog.component';

@Injectable()
export class PaymentCardResolvePagingParams implements Resolve<any> {

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

export const paymentCardRoute: Routes = [
    {
        path: 'payment-card',
        component: PaymentCardComponent,
        resolve: {
            'pagingParams': PaymentCardResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.paymentCard.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'payment-card/:id',
        component: PaymentCardDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.paymentCard.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const paymentCardPopupRoute: Routes = [
    {
        path: 'payment-card-new',
        component: PaymentCardPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.paymentCard.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'payment-card/:id/edit',
        component: PaymentCardPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.paymentCard.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'payment-card/:id/delete',
        component: PaymentCardDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.paymentCard.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
