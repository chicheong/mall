import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { ShippingStatusHistoryComponent } from './shipping-status-history.component';
import { ShippingStatusHistoryDetailComponent } from './shipping-status-history-detail.component';
import { ShippingStatusHistoryPopupComponent } from './shipping-status-history-dialog.component';
import { ShippingStatusHistoryDeletePopupComponent } from './shipping-status-history-delete-dialog.component';

export const shippingStatusHistoryRoute: Routes = [
    {
        path: 'shipping-status-history',
        component: ShippingStatusHistoryComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shippingStatusHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'shipping-status-history/:id',
        component: ShippingStatusHistoryDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shippingStatusHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const shippingStatusHistoryPopupRoute: Routes = [
    {
        path: 'shipping-status-history-new',
        component: ShippingStatusHistoryPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shippingStatusHistory.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'shipping-status-history/:id/edit',
        component: ShippingStatusHistoryPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shippingStatusHistory.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'shipping-status-history/:id/delete',
        component: ShippingStatusHistoryDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shippingStatusHistory.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
