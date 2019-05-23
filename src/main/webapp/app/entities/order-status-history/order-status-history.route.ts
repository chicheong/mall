import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { OrderStatusHistory } from 'app/shared/model/order-status-history.model';
import { OrderStatusHistoryService } from './order-status-history.service';
import { OrderStatusHistoryComponent } from './order-status-history.component';
import { OrderStatusHistoryDetailComponent } from './order-status-history-detail.component';
import { OrderStatusHistoryUpdateComponent } from './order-status-history-update.component';
import { OrderStatusHistoryDeletePopupComponent } from './order-status-history-delete-dialog.component';
import { IOrderStatusHistory } from 'app/shared/model/order-status-history.model';

@Injectable({ providedIn: 'root' })
export class OrderStatusHistoryResolve implements Resolve<IOrderStatusHistory> {
    constructor(private service: OrderStatusHistoryService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IOrderStatusHistory> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<OrderStatusHistory>) => response.ok),
                map((orderStatusHistory: HttpResponse<OrderStatusHistory>) => orderStatusHistory.body)
            );
        }
        return of(new OrderStatusHistory());
    }
}

export const orderStatusHistoryRoute: Routes = [
    {
        path: '',
        component: OrderStatusHistoryComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.orderStatusHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: OrderStatusHistoryDetailComponent,
        resolve: {
            orderStatusHistory: OrderStatusHistoryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.orderStatusHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: OrderStatusHistoryUpdateComponent,
        resolve: {
            orderStatusHistory: OrderStatusHistoryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.orderStatusHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: OrderStatusHistoryUpdateComponent,
        resolve: {
            orderStatusHistory: OrderStatusHistoryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.orderStatusHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const orderStatusHistoryPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: OrderStatusHistoryDeletePopupComponent,
        resolve: {
            orderStatusHistory: OrderStatusHistoryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.orderStatusHistory.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
