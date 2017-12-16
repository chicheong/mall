import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { DelegationComponent } from './delegation.component';
import { DelegationDetailComponent } from './delegation-detail.component';
import { DelegationPopupComponent } from './delegation-dialog.component';
import { DelegationDeletePopupComponent } from './delegation-delete-dialog.component';

export const delegationRoute: Routes = [
    {
        path: 'delegation',
        component: DelegationComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.delegation.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'delegation/:id',
        component: DelegationDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.delegation.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const delegationPopupRoute: Routes = [
    {
        path: 'delegation-new',
        component: DelegationPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.delegation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'delegation/:id/edit',
        component: DelegationPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.delegation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'delegation/:id/delete',
        component: DelegationDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.delegation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
