import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ShippingStatusHistory } from 'app/shared/model/shipping-status-history.model';
import { ShippingStatusHistoryService } from './shipping-status-history.service';
import { ShippingStatusHistoryComponent } from './shipping-status-history.component';
import { ShippingStatusHistoryDetailComponent } from './shipping-status-history-detail.component';
import { ShippingStatusHistoryUpdateComponent } from './shipping-status-history-update.component';
import { ShippingStatusHistoryDeletePopupComponent } from './shipping-status-history-delete-dialog.component';
import { IShippingStatusHistory } from 'app/shared/model/shipping-status-history.model';

@Injectable({ providedIn: 'root' })
export class ShippingStatusHistoryResolve implements Resolve<IShippingStatusHistory> {
    constructor(private service: ShippingStatusHistoryService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IShippingStatusHistory> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<ShippingStatusHistory>) => response.ok),
                map((shippingStatusHistory: HttpResponse<ShippingStatusHistory>) => shippingStatusHistory.body)
            );
        }
        return of(new ShippingStatusHistory());
    }
}

export const shippingStatusHistoryRoute: Routes = [
    {
        path: '',
        component: ShippingStatusHistoryComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shippingStatusHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: ShippingStatusHistoryDetailComponent,
        resolve: {
            shippingStatusHistory: ShippingStatusHistoryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shippingStatusHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: ShippingStatusHistoryUpdateComponent,
        resolve: {
            shippingStatusHistory: ShippingStatusHistoryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shippingStatusHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: ShippingStatusHistoryUpdateComponent,
        resolve: {
            shippingStatusHistory: ShippingStatusHistoryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shippingStatusHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const shippingStatusHistoryPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: ShippingStatusHistoryDeletePopupComponent,
        resolve: {
            shippingStatusHistory: ShippingStatusHistoryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shippingStatusHistory.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
