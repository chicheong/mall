import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { ProductStyleHistoryComponent } from './product-style-history.component';
import { ProductStyleHistoryDetailComponent } from './product-style-history-detail.component';
import { ProductStyleHistoryPopupComponent } from './product-style-history-dialog.component';
import { ProductStyleHistoryDeletePopupComponent } from './product-style-history-delete-dialog.component';

export const productStyleHistoryRoute: Routes = [
    {
        path: 'product-style-history',
        component: ProductStyleHistoryComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productStyleHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'product-style-history/:id',
        component: ProductStyleHistoryDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productStyleHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const productStyleHistoryPopupRoute: Routes = [
    {
        path: 'product-style-history-new',
        component: ProductStyleHistoryPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productStyleHistory.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'product-style-history/:id/edit',
        component: ProductStyleHistoryPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productStyleHistory.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'product-style-history/:id/delete',
        component: ProductStyleHistoryDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productStyleHistory.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
