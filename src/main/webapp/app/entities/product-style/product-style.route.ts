import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ProductStyle } from 'app/shared/model/product-style.model';
import { ProductStyleService } from './product-style.service';
import { ProductStyleComponent } from './product-style.component';
import { ProductStyleDetailComponent } from './product-style-detail.component';
import { ProductStyleUpdateComponent } from './product-style-update.component';
import { ProductStyleDeletePopupComponent } from './product-style-delete-dialog.component';
import { IProductStyle } from 'app/shared/model/product-style.model';

@Injectable({ providedIn: 'root' })
export class ProductStyleResolve implements Resolve<IProductStyle> {
    constructor(private service: ProductStyleService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProductStyle> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<ProductStyle>) => response.ok),
                map((productStyle: HttpResponse<ProductStyle>) => productStyle.body)
            );
        }
        return of(new ProductStyle());
    }
}

export const productStyleRoute: Routes = [
    {
        path: '',
        component: ProductStyleComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productStyle.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: ProductStyleDetailComponent,
        resolve: {
            productStyle: ProductStyleResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productStyle.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: ProductStyleUpdateComponent,
        resolve: {
            productStyle: ProductStyleResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productStyle.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: ProductStyleUpdateComponent,
        resolve: {
            productStyle: ProductStyleResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productStyle.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const productStylePopupRoute: Routes = [
    {
        path: ':id/delete',
        component: ProductStyleDeletePopupComponent,
        resolve: {
            productStyle: ProductStyleResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.productStyle.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
