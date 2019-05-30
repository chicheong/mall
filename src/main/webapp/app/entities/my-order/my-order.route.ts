import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { MyOrder } from 'app/shared/model/my-order.model';
import { MyOrderService } from './my-order.service';
import { MyOrderComponent } from './my-order.component';
import { MyOrderDetailComponent } from './my-order-detail.component';
import { MyOrderUpdateComponent } from './my-order-update.component';
import { MyOrderDeletePopupComponent } from './my-order-delete-dialog.component';
import { CartPendingComponent } from './cart/cart-pending/cart-pending.component';
import { CartReviewComponent } from './cart/cart-review/cart-review.component';
import { CartShippingComponent } from './cart/cart-shipping/cart-shipping.component';
import { CartMethodComponent } from './cart/cart-method/cart-method.component';
import { CartBillingComponent } from './cart/cart-billing/cart-billing.component';
import { CartPaymentComponent } from './cart/cart-payment/cart-payment.component';
import { CartConfirmationComponent } from './cart/cart-confirmation/cart-confirmation.component';
import { CheckoutComponent } from './checkout.component';
import { IMyOrder } from 'app/shared/model/my-order.model';

@Injectable({ providedIn: 'root' })
export class MyOrderResolve implements Resolve<IMyOrder> {
    constructor(private service: MyOrderService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IMyOrder> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<MyOrder>) => response.ok),
                map((myOrder: HttpResponse<MyOrder>) => myOrder.body)
            );
        }
        return of(new MyOrder());
    }
}

export const myOrderRoute: Routes = [
    {
        path: '',
        component: MyOrderComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'mallApp.myOrder.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: MyOrderDetailComponent,
        resolve: {
            myOrder: MyOrderResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.myOrder.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: MyOrderUpdateComponent,
        resolve: {
            myOrder: MyOrderResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.myOrder.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: MyOrderUpdateComponent,
        resolve: {
            myOrder: MyOrderResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.myOrder.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const myOrderPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: MyOrderDeletePopupComponent,
        resolve: {
            myOrder: MyOrderResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.myOrder.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
