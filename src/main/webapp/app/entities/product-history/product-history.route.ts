import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ProductHistory } from 'app/shared/model/product-history.model';
import { ProductHistoryService } from './product-history.service';
import { ProductHistoryComponent } from './product-history.component';
import { ProductHistoryDetailComponent } from './product-history-detail.component';
import { ProductHistoryUpdateComponent } from './product-history-update.component';
import { ProductHistoryDeletePopupComponent } from './product-history-delete-dialog.component';
import { IProductHistory } from 'app/shared/model/product-history.model';

@Injectable({ providedIn: 'root' })
export class ProductHistoryResolve implements Resolve<IProductHistory> {
    constructor(private service: ProductHistoryService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProductHistory> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<ProductHistory>) => response.ok),
                map((productHistory: HttpResponse<ProductHistory>) => productHistory.body)
            );
        }
        return of(new ProductHistory());
    }
}

export const productHistoryRoute: Routes = [
    {
        path: '',
        component: ProductHistoryComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: ProductHistoryDetailComponent,
        resolve: {
            productHistory: ProductHistoryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: ProductHistoryUpdateComponent,
        resolve: {
            productHistory: ProductHistoryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: ProductHistoryUpdateComponent,
        resolve: {
            productHistory: ProductHistoryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const productHistoryPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: ProductHistoryDeletePopupComponent,
        resolve: {
            productHistory: ProductHistoryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productHistory.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
