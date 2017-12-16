import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { ProductHistoryComponent } from './product-history.component';
import { ProductHistoryDetailComponent } from './product-history-detail.component';
import { ProductHistoryPopupComponent } from './product-history-dialog.component';
import { ProductHistoryDeletePopupComponent } from './product-history-delete-dialog.component';

export const productHistoryRoute: Routes = [
    {
        path: 'product-history',
        component: ProductHistoryComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'product-history/:id',
        component: ProductHistoryDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const productHistoryPopupRoute: Routes = [
    {
        path: 'product-history-new',
        component: ProductHistoryPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productHistory.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'product-history/:id/edit',
        component: ProductHistoryPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productHistory.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'product-history/:id/delete',
        component: ProductHistoryDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productHistory.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
