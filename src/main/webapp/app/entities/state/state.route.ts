import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { State } from 'app/shared/model/state.model';
import { StateService } from './state.service';
import { StateComponent } from './state.component';
import { StateDetailComponent } from './state-detail.component';
import { StateUpdateComponent } from './state-update.component';
import { StateDeletePopupComponent } from './state-delete-dialog.component';
import { IState } from 'app/shared/model/state.model';

@Injectable({ providedIn: 'root' })
export class StateResolve implements Resolve<IState> {
    constructor(private service: StateService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IState> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<State>) => response.ok),
                map((state: HttpResponse<State>) => state.body)
            );
        }
        return of(new State());
    }
}

export const stateRoute: Routes = [
    {
        path: '',
        component: StateComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'mallApp.state.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: StateDetailComponent,
        resolve: {
            state: StateResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.state.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: StateUpdateComponent,
        resolve: {
            state: StateResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.state.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: StateUpdateComponent,
        resolve: {
            state: StateResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.state.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const statePopupRoute: Routes = [
    {
        path: ':id/delete',
        component: StateDeletePopupComponent,
        resolve: {
            state: StateResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.state.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
