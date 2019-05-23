import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ProductStyleHistory } from 'app/shared/model/product-style-history.model';
import { ProductStyleHistoryService } from './product-style-history.service';
import { ProductStyleHistoryComponent } from './product-style-history.component';
import { ProductStyleHistoryDetailComponent } from './product-style-history-detail.component';
import { ProductStyleHistoryUpdateComponent } from './product-style-history-update.component';
import { ProductStyleHistoryDeletePopupComponent } from './product-style-history-delete-dialog.component';
import { IProductStyleHistory } from 'app/shared/model/product-style-history.model';

@Injectable({ providedIn: 'root' })
export class ProductStyleHistoryResolve implements Resolve<IProductStyleHistory> {
    constructor(private service: ProductStyleHistoryService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProductStyleHistory> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<ProductStyleHistory>) => response.ok),
                map((productStyleHistory: HttpResponse<ProductStyleHistory>) => productStyleHistory.body)
            );
        }
        return of(new ProductStyleHistory());
    }
}

export const productStyleHistoryRoute: Routes = [
    {
        path: '',
        component: ProductStyleHistoryComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productStyleHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: ProductStyleHistoryDetailComponent,
        resolve: {
            productStyleHistory: ProductStyleHistoryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productStyleHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: ProductStyleHistoryUpdateComponent,
        resolve: {
            productStyleHistory: ProductStyleHistoryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productStyleHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: ProductStyleHistoryUpdateComponent,
        resolve: {
            productStyleHistory: ProductStyleHistoryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productStyleHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const productStyleHistoryPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: ProductStyleHistoryDeletePopupComponent,
        resolve: {
            productStyleHistory: ProductStyleHistoryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productStyleHistory.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
