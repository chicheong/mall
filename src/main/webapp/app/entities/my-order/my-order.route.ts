import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { MyOrderComponent } from './my-order.component';
import { CartReviewComponent } from './cart/cart-review/cart-review.component';
import { CartShippingComponent } from './cart/cart-shipping/cart-shipping.component';
import { CartMethodComponent } from './cart/cart-method/cart-method.component';
import { CartBillingComponent } from './cart/cart-billing/cart-billing.component';
import { CartPaymentComponent } from './cart/cart-payment/cart-payment.component';
import { MyOrderPopupComponent } from './my-order-dialog.component';
import { MyOrderDeletePopupComponent } from './my-order-delete-dialog.component';
import { CheckoutComponent } from './checkout.component';

@Injectable()
export class MyOrderResolvePagingParams implements Resolve<any> {

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

export const myOrderRoute: Routes = [
    {
        path: 'my-order',
        component: MyOrderComponent,
        resolve: {
            'pagingParams': MyOrderResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.myOrder.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'my-order/:id/review',
        component: CartReviewComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.myOrder.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'my-order/:id/shipping',
        component: CartShippingComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.myOrder.checkout.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'my-order/:id/method',
        component: CartMethodComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.myOrder.checkout.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'my-order/:id/billing',
        component: CartBillingComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.myOrder.checkout.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'my-order/:id/payment',
        component: CartPaymentComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.myOrder.checkout.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const myOrderPopupRoute: Routes = [
    {
        path: 'my-order-new',
        component: MyOrderPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.myOrder.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'my-order/:id/edit',
        component: MyOrderPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.myOrder.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'my-order/:id/delete',
        component: MyOrderDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.myOrder.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
