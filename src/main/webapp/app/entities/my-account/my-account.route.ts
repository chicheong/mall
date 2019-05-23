import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { MyAccount } from 'app/shared/model/my-account.model';
import { MyAccountService } from './my-account.service';
import { MyAccountComponent } from './my-account.component';
import { MyAccountDetailComponent } from './my-account-detail.component';
import { MyAccountUpdateComponent } from './my-account-update.component';
import { MyAccountDeletePopupComponent } from './my-account-delete-dialog.component';
import { IMyAccount } from 'app/shared/model/my-account.model';

@Injectable({ providedIn: 'root' })
export class MyAccountResolve implements Resolve<IMyAccount> {
    constructor(private service: MyAccountService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IMyAccount> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<MyAccount>) => response.ok),
                map((myAccount: HttpResponse<MyAccount>) => myAccount.body)
            );
        }
        return of(new MyAccount());
    }
}

export const myAccountRoute: Routes = [
    {
        path: '',
        component: MyAccountComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'mallApp.myAccount.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: MyAccountDetailComponent,
        resolve: {
            myAccount: MyAccountResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.myAccount.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: MyAccountUpdateComponent,
        resolve: {
            myAccount: MyAccountResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.myAccount.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: MyAccountUpdateComponent,
        resolve: {
            myAccount: MyAccountResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.myAccount.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const myAccountPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: MyAccountDeletePopupComponent,
        resolve: {
            myAccount: MyAccountResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.myAccount.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
