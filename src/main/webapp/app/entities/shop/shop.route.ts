import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Shop } from 'app/shared/model/shop.model';
import { ShopService } from './shop.service';
import { ShopComponent } from './shop.component';
import { ShopDetailComponent } from './shop-detail.component';
import { ShopUpdateComponent } from './shop-update.component';
import { ShopDeletePopupComponent } from './shop-delete-dialog.component';
import { IShop } from 'app/shared/model/shop.model';

@Injectable({ providedIn: 'root' })
export class ShopResolve implements Resolve<IShop> {
    constructor(private service: ShopService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IShop> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Shop>) => response.ok),
                map((shop: HttpResponse<Shop>) => shop.body)
            );
        }
        return of(new Shop());
    }
}

export const shopRoute: Routes = [
    {
        path: '',
        component: ShopComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'mallApp.shop.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: ShopDetailComponent,
        resolve: {
            shop: ShopResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shop.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: ShopUpdateComponent,
        resolve: {
            shop: ShopResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shop.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: ShopUpdateComponent,
        resolve: {
            shop: ShopResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shop.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const shopPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: ShopDeletePopupComponent,
        resolve: {
            shop: ShopResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shop.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
