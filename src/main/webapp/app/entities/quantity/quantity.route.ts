import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Quantity } from 'app/shared/model/quantity.model';
import { QuantityService } from './quantity.service';
import { QuantityComponent } from './quantity.component';
import { QuantityDetailComponent } from './quantity-detail.component';
import { QuantityUpdateComponent } from './quantity-update.component';
import { QuantityDeletePopupComponent } from './quantity-delete-dialog.component';
import { IQuantity } from 'app/shared/model/quantity.model';

@Injectable({ providedIn: 'root' })
export class QuantityResolve implements Resolve<IQuantity> {
    constructor(private service: QuantityService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IQuantity> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Quantity>) => response.ok),
                map((quantity: HttpResponse<Quantity>) => quantity.body)
            );
        }
        return of(new Quantity());
    }
}

export const quantityRoute: Routes = [
    {
        path: '',
        component: QuantityComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'mallApp.quantity.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: QuantityDetailComponent,
        resolve: {
            quantity: QuantityResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.quantity.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: QuantityUpdateComponent,
        resolve: {
            quantity: QuantityResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.quantity.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: QuantityUpdateComponent,
        resolve: {
            quantity: QuantityResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.quantity.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const quantityPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: QuantityDeletePopupComponent,
        resolve: {
            quantity: QuantityResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.quantity.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
