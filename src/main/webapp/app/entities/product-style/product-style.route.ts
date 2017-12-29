import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { ProductStyleComponent } from './product-style.component';
import { ProductStyleDetailComponent } from './product-style-detail.component';
import { ProductStylePopupComponent } from './product-style-dialog.component';
import { ProductStyleDeletePopupComponent } from './product-style-delete-dialog.component';

export const productStyleRoute: Routes = [
    {
        path: 'product-style',
        component: ProductStyleComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productStyle.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'product-style/:id',
        component: ProductStyleDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productStyle.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const productStylePopupRoute: Routes = [
    {
        path: 'product-style-new',
        component: ProductStylePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productStyle.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'product-style/:id/edit',
        component: ProductStylePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productStyle.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'product-style/:id/delete',
        component: ProductStyleDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productStyle.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
