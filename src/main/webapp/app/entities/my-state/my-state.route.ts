import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { MyState } from 'app/shared/model/my-state.model';
import { MyStateService } from './my-state.service';
import { MyStateComponent } from './my-state.component';
import { MyStateDetailComponent } from './my-state-detail.component';
import { MyStateUpdateComponent } from './my-state-update.component';
import { MyStateDeletePopupComponent } from './my-state-delete-dialog.component';
import { IMyState } from 'app/shared/model/my-state.model';

@Injectable({ providedIn: 'root' })
export class MyStateResolve implements Resolve<IMyState> {
    constructor(private service: MyStateService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IMyState> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<MyState>) => response.ok),
                map((myState: HttpResponse<MyState>) => myState.body)
            );
        }
        return of(new MyState());
    }
}

export const myStateRoute: Routes = [
    {
        path: '',
        component: MyStateComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'mallApp.myState.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: MyStateDetailComponent,
        resolve: {
            myState: MyStateResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.myState.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: MyStateUpdateComponent,
        resolve: {
            myState: MyStateResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.myState.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: MyStateUpdateComponent,
        resolve: {
            myState: MyStateResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.myState.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const myStatePopupRoute: Routes = [
    {
        path: ':id/delete',
        component: MyStateDeletePopupComponent,
        resolve: {
            myState: MyStateResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.myState.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
