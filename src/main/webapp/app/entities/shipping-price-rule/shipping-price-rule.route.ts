import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ShippingPriceRule } from 'app/shared/model/shipping-price-rule.model';
import { ShippingPriceRuleService } from './shipping-price-rule.service';
import { ShippingPriceRuleComponent } from './shipping-price-rule.component';
import { ShippingPriceRuleDetailComponent } from './shipping-price-rule-detail.component';
import { ShippingPriceRuleUpdateComponent } from './shipping-price-rule-update.component';
import { ShippingPriceRuleDeletePopupComponent } from './shipping-price-rule-delete-dialog.component';
import { IShippingPriceRule } from 'app/shared/model/shipping-price-rule.model';

@Injectable({ providedIn: 'root' })
export class ShippingPriceRuleResolve implements Resolve<IShippingPriceRule> {
    constructor(private service: ShippingPriceRuleService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IShippingPriceRule> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<ShippingPriceRule>) => response.ok),
                map((shippingPriceRule: HttpResponse<ShippingPriceRule>) => shippingPriceRule.body)
            );
        }
        return of(new ShippingPriceRule());
    }
}

export const shippingPriceRuleRoute: Routes = [
    {
        path: '',
        component: ShippingPriceRuleComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'mallApp.shippingPriceRule.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: ShippingPriceRuleDetailComponent,
        resolve: {
            shippingPriceRule: ShippingPriceRuleResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shippingPriceRule.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: ShippingPriceRuleUpdateComponent,
        resolve: {
            shippingPriceRule: ShippingPriceRuleResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shippingPriceRule.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: ShippingPriceRuleUpdateComponent,
        resolve: {
            shippingPriceRule: ShippingPriceRuleResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shippingPriceRule.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const shippingPriceRulePopupRoute: Routes = [
    {
        path: ':id/delete',
        component: ShippingPriceRuleDeletePopupComponent,
        resolve: {
            shippingPriceRule: ShippingPriceRuleResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.shippingPriceRule.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
