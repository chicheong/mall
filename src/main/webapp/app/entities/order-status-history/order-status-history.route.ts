import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { OrderStatusHistoryComponent } from './order-status-history.component';
import { OrderStatusHistoryDetailComponent } from './order-status-history-detail.component';
import { OrderStatusHistoryPopupComponent } from './order-status-history-dialog.component';
import { OrderStatusHistoryDeletePopupComponent } from './order-status-history-delete-dialog.component';

export const orderStatusHistoryRoute: Routes = [
    {
        path: 'order-status-history',
        component: OrderStatusHistoryComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.orderStatusHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'order-status-history/:id',
        component: OrderStatusHistoryDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.orderStatusHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const orderStatusHistoryPopupRoute: Routes = [
    {
        path: 'order-status-history-new',
        component: OrderStatusHistoryPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.orderStatusHistory.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'order-status-history/:id/edit',
        component: OrderStatusHistoryPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.orderStatusHistory.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'order-status-history/:id/delete',
        component: OrderStatusHistoryDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.orderStatusHistory.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
