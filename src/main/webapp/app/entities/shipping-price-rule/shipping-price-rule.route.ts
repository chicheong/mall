import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { ShippingPriceRuleComponent } from './shipping-price-rule.component';
import { ShippingPriceRuleDetailComponent } from './shipping-price-rule-detail.component';
import { ShippingPriceRulePopupComponent } from './shipping-price-rule-dialog.component';
import { ShippingPriceRuleDeletePopupComponent } from './shipping-price-rule-delete-dialog.component';

@Injectable()
export class ShippingPriceRuleResolvePagingParams implements Resolve<any> {

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

export const shippingPriceRuleRoute: Routes = [
    {
        path: 'shipping-price-rule',
        component: ShippingPriceRuleComponent,
        resolve: {
            'pagingParams': ShippingPriceRuleResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shippingPriceRule.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'shipping-price-rule/:id',
        component: ShippingPriceRuleDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shippingPriceRule.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const shippingPriceRulePopupRoute: Routes = [
    {
        path: 'shipping-price-rule-new',
        component: ShippingPriceRulePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shippingPriceRule.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'shipping-price-rule/:id/edit',
        component: ShippingPriceRulePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shippingPriceRule.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'shipping-price-rule/:id/delete',
        component: ShippingPriceRuleDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shippingPriceRule.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
