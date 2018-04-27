import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { MyOrderComponent } from './my-order.component';
import { ReviewCartComponent } from './cart/review-cart/review-cart.component';
import { ShippingInfoComponent } from './cart/shipping-info/shipping-info.component';
import { ShippingComponent } from './cart/shipping/shipping.component';
import { BillingInfoComponent } from './cart/billing-info/billing-info.component';
import { PaymentComponent } from './cart/payment/payment.component';
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
        path: 'my-order/:id/review-cart',
        component: ReviewCartComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.myOrder.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'my-order/:id/shipping-info',
        component: ShippingInfoComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.myOrder.checkout.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'my-order/:id/shipping',
        component: ShippingComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.myOrder.checkout.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'my-order/:id/billing-info',
        component: BillingInfoComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.myOrder.checkout.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'my-order/:id/payment',
        component: PaymentComponent,
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
