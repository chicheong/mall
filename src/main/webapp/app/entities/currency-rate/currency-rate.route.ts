import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { CurrencyRateComponent } from './currency-rate.component';
import { CurrencyRateDetailComponent } from './currency-rate-detail.component';
import { CurrencyRatePopupComponent } from './currency-rate-dialog.component';
import { CurrencyRateDeletePopupComponent } from './currency-rate-delete-dialog.component';

export const currencyRateRoute: Routes = [
    {
        path: 'currency-rate',
        component: CurrencyRateComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.currencyRate.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'currency-rate/:id',
        component: CurrencyRateDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.currencyRate.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const currencyRatePopupRoute: Routes = [
    {
        path: 'currency-rate-new',
        component: CurrencyRatePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.currencyRate.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'currency-rate/:id/edit',
        component: CurrencyRatePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.currencyRate.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'currency-rate/:id/delete',
        component: CurrencyRateDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.currencyRate.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
