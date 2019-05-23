import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ProductItem } from 'app/shared/model/product-item.model';
import { ProductItemService } from './product-item.service';
import { ProductItemComponent } from './product-item.component';
import { ProductItemDetailComponent } from './product-item-detail.component';
import { ProductItemUpdateComponent } from './product-item-update.component';
import { ProductItemDeletePopupComponent } from './product-item-delete-dialog.component';
import { IProductItem } from 'app/shared/model/product-item.model';

@Injectable({ providedIn: 'root' })
export class ProductItemResolve implements Resolve<IProductItem> {
    constructor(private service: ProductItemService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProductItem> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<ProductItem>) => response.ok),
                map((productItem: HttpResponse<ProductItem>) => productItem.body)
            );
        }
        return of(new ProductItem());
    }
}

export const productItemRoute: Routes = [
    {
        path: '',
        component: ProductItemComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'mallApp.productItem.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: ProductItemDetailComponent,
        resolve: {
            productItem: ProductItemResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productItem.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: ProductItemUpdateComponent,
        resolve: {
            productItem: ProductItemResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productItem.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: ProductItemUpdateComponent,
        resolve: {
            productItem: ProductItemResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productItem.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const productItemPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: ProductItemDeletePopupComponent,
        resolve: {
            productItem: ProductItemResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productItem.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
