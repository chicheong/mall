import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { CreditCardComponent } from './credit-card.component';
import { CreditCardDetailComponent } from './credit-card-detail.component';
import { CreditCardPopupComponent } from './credit-card-dialog.component';
import { CreditCardDeletePopupComponent } from './credit-card-delete-dialog.component';

@Injectable()
export class CreditCardResolvePagingParams implements Resolve<any> {

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

export const creditCardRoute: Routes = [
    {
        path: 'credit-card',
        component: CreditCardComponent,
        resolve: {
            'pagingParams': CreditCardResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.creditCard.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'credit-card/:id',
        component: CreditCardDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.creditCard.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const creditCardPopupRoute: Routes = [
    {
        path: 'credit-card-new',
        component: CreditCardPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.creditCard.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'credit-card/:id/edit',
        component: CreditCardPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.creditCard.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'credit-card/:id/delete',
        component: CreditCardDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.creditCard.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
