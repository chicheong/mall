import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { ProductItemHistoryComponent } from './product-item-history.component';
import { ProductItemHistoryDetailComponent } from './product-item-history-detail.component';
import { ProductItemHistoryPopupComponent } from './product-item-history-dialog.component';
import { ProductItemHistoryDeletePopupComponent } from './product-item-history-delete-dialog.component';

export const productItemHistoryRoute: Routes = [
    {
        path: 'product-item-history',
        component: ProductItemHistoryComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productItemHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'product-item-history/:id',
        component: ProductItemHistoryDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productItemHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const productItemHistoryPopupRoute: Routes = [
    {
        path: 'product-item-history-new',
        component: ProductItemHistoryPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productItemHistory.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'product-item-history/:id/edit',
        component: ProductItemHistoryPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productItemHistory.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'product-item-history/:id/delete',
        component: ProductItemHistoryDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productItemHistory.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
