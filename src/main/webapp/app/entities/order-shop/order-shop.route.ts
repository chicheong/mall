import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { OrderShop } from 'app/shared/model/order-shop.model';
import { OrderShopService } from './order-shop.service';
import { OrderShopComponent } from './order-shop.component';
import { OrderShopDetailComponent } from './order-shop-detail.component';
import { OrderShopUpdateComponent } from './order-shop-update.component';
import { OrderShopDeletePopupComponent } from './order-shop-delete-dialog.component';
import { IOrderShop } from 'app/shared/model/order-shop.model';

@Injectable({ providedIn: 'root' })
export class OrderShopResolve implements Resolve<IOrderShop> {
    constructor(private service: OrderShopService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IOrderShop> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<OrderShop>) => response.ok),
                map((orderShop: HttpResponse<OrderShop>) => orderShop.body)
            );
        }
        return of(new OrderShop());
    }
}

export const orderShopRoute: Routes = [
    {
        path: '',
        component: OrderShopComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'mallApp.orderShop.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: OrderShopDetailComponent,
        resolve: {
            orderShop: OrderShopResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.orderShop.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: OrderShopUpdateComponent,
        resolve: {
            orderShop: OrderShopResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.orderShop.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: OrderShopUpdateComponent,
        resolve: {
            orderShop: OrderShopResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.orderShop.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const orderShopPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: OrderShopDeletePopupComponent,
        resolve: {
            orderShop: OrderShopResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.orderShop.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
