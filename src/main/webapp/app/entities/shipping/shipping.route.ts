import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Shipping } from 'app/shared/model/shipping.model';
import { ShippingService } from './shipping.service';
import { ShippingComponent } from './shipping.component';
import { ShippingDetailComponent } from './shipping-detail.component';
import { ShippingUpdateComponent } from './shipping-update.component';
import { ShippingDeletePopupComponent } from './shipping-delete-dialog.component';
import { IShipping } from 'app/shared/model/shipping.model';

@Injectable({ providedIn: 'root' })
export class ShippingResolve implements Resolve<IShipping> {
    constructor(private service: ShippingService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IShipping> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Shipping>) => response.ok),
                map((shipping: HttpResponse<Shipping>) => shipping.body)
            );
        }
        return of(new Shipping());
    }
}

export const shippingRoute: Routes = [
    {
        path: '',
        component: ShippingComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'mallApp.shipping.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: ShippingDetailComponent,
        resolve: {
            shipping: ShippingResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shipping.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: ShippingUpdateComponent,
        resolve: {
            shipping: ShippingResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shipping.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: ShippingUpdateComponent,
        resolve: {
            shipping: ShippingResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shipping.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const shippingPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: ShippingDeletePopupComponent,
        resolve: {
            shipping: ShippingResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shipping.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
