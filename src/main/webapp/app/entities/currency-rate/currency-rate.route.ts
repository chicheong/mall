import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { CurrencyRate } from 'app/shared/model/currency-rate.model';
import { CurrencyRateService } from './currency-rate.service';
import { CurrencyRateComponent } from './currency-rate.component';
import { CurrencyRateDetailComponent } from './currency-rate-detail.component';
import { CurrencyRateUpdateComponent } from './currency-rate-update.component';
import { CurrencyRateDeletePopupComponent } from './currency-rate-delete-dialog.component';
import { ICurrencyRate } from 'app/shared/model/currency-rate.model';

@Injectable({ providedIn: 'root' })
export class CurrencyRateResolve implements Resolve<ICurrencyRate> {
    constructor(private service: CurrencyRateService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICurrencyRate> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<CurrencyRate>) => response.ok),
                map((currencyRate: HttpResponse<CurrencyRate>) => currencyRate.body)
            );
        }
        return of(new CurrencyRate());
    }
}

export const currencyRateRoute: Routes = [
    {
        path: '',
        component: CurrencyRateComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.currencyRate.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: CurrencyRateDetailComponent,
        resolve: {
            currencyRate: CurrencyRateResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.currencyRate.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: CurrencyRateUpdateComponent,
        resolve: {
            currencyRate: CurrencyRateResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.currencyRate.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: CurrencyRateUpdateComponent,
        resolve: {
            currencyRate: CurrencyRateResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.currencyRate.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const currencyRatePopupRoute: Routes = [
    {
        path: ':id/delete',
        component: CurrencyRateDeletePopupComponent,
        resolve: {
            currencyRate: CurrencyRateResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.currencyRate.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
