import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaymentStatusHistoryComponent } from './payment-status-history.component';
import { PaymentStatusHistoryDetailComponent } from './payment-status-history-detail.component';
import { PaymentStatusHistoryPopupComponent } from './payment-status-history-dialog.component';
import { PaymentStatusHistoryDeletePopupComponent } from './payment-status-history-delete-dialog.component';

export const paymentStatusHistoryRoute: Routes = [
    {
        path: 'payment-status-history',
        component: PaymentStatusHistoryComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.paymentStatusHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'payment-status-history/:id',
        component: PaymentStatusHistoryDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.paymentStatusHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const paymentStatusHistoryPopupRoute: Routes = [
    {
        path: 'payment-status-history-new',
        component: PaymentStatusHistoryPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.paymentStatusHistory.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'payment-status-history/:id/edit',
        component: PaymentStatusHistoryPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.paymentStatusHistory.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'payment-status-history/:id/delete',
        component: PaymentStatusHistoryDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.paymentStatusHistory.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
