import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { PaymentCreditCardComponent } from './payment-credit-card.component';
import { PaymentCreditCardDetailComponent } from './payment-credit-card-detail.component';
import { PaymentCreditCardPopupComponent } from './payment-credit-card-dialog.component';
import { PaymentCreditCardDeletePopupComponent } from './payment-credit-card-delete-dialog.component';

@Injectable()
export class PaymentCreditCardResolvePagingParams implements Resolve<any> {

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

export const paymentCreditCardRoute: Routes = [
    {
        path: 'payment-credit-card',
        component: PaymentCreditCardComponent,
        resolve: {
            'pagingParams': PaymentCreditCardResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.paymentCreditCard.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'payment-credit-card/:id',
        component: PaymentCreditCardDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.paymentCreditCard.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const paymentCreditCardPopupRoute: Routes = [
    {
        path: 'payment-credit-card-new',
        component: PaymentCreditCardPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.paymentCreditCard.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'payment-credit-card/:id/edit',
        component: PaymentCreditCardPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.paymentCreditCard.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'payment-credit-card/:id/delete',
        component: PaymentCreditCardDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.paymentCreditCard.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
