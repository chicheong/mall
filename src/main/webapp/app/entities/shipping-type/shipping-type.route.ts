import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ShippingType } from 'app/shared/model/shipping-type.model';
import { ShippingTypeService } from './shipping-type.service';
import { ShippingTypeComponent } from './shipping-type.component';
import { ShippingTypeDetailComponent } from './shipping-type-detail.component';
import { ShippingTypeUpdateComponent } from './shipping-type-update.component';
import { ShippingTypeDeletePopupComponent } from './shipping-type-delete-dialog.component';
import { IShippingType } from 'app/shared/model/shipping-type.model';

@Injectable({ providedIn: 'root' })
export class ShippingTypeResolve implements Resolve<IShippingType> {
    constructor(private service: ShippingTypeService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IShippingType> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<ShippingType>) => response.ok),
                map((shippingType: HttpResponse<ShippingType>) => shippingType.body)
            );
        }
        return of(new ShippingType());
    }
}

export const shippingTypeRoute: Routes = [
    {
        path: '',
        component: ShippingTypeComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'mallApp.shippingType.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: ShippingTypeDetailComponent,
        resolve: {
            shippingType: ShippingTypeResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shippingType.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: ShippingTypeUpdateComponent,
        resolve: {
            shippingType: ShippingTypeResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shippingType.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: ShippingTypeUpdateComponent,
        resolve: {
            shippingType: ShippingTypeResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shippingType.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const shippingTypePopupRoute: Routes = [
    {
        path: ':id/delete',
        component: ShippingTypeDeletePopupComponent,
        resolve: {
            shippingType: ShippingTypeResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shippingType.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
