import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ProductItemHistory } from 'app/shared/model/product-item-history.model';
import { ProductItemHistoryService } from './product-item-history.service';
import { ProductItemHistoryComponent } from './product-item-history.component';
import { ProductItemHistoryDetailComponent } from './product-item-history-detail.component';
import { ProductItemHistoryUpdateComponent } from './product-item-history-update.component';
import { ProductItemHistoryDeletePopupComponent } from './product-item-history-delete-dialog.component';
import { IProductItemHistory } from 'app/shared/model/product-item-history.model';

@Injectable({ providedIn: 'root' })
export class ProductItemHistoryResolve implements Resolve<IProductItemHistory> {
    constructor(private service: ProductItemHistoryService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProductItemHistory> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<ProductItemHistory>) => response.ok),
                map((productItemHistory: HttpResponse<ProductItemHistory>) => productItemHistory.body)
            );
        }
        return of(new ProductItemHistory());
    }
}

export const productItemHistoryRoute: Routes = [
    {
        path: '',
        component: ProductItemHistoryComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productItemHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: ProductItemHistoryDetailComponent,
        resolve: {
            productItemHistory: ProductItemHistoryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productItemHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: ProductItemHistoryUpdateComponent,
        resolve: {
            productItemHistory: ProductItemHistoryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productItemHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: ProductItemHistoryUpdateComponent,
        resolve: {
            productItemHistory: ProductItemHistoryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productItemHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const productItemHistoryPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: ProductItemHistoryDeletePopupComponent,
        resolve: {
            productItemHistory: ProductItemHistoryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productItemHistory.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
