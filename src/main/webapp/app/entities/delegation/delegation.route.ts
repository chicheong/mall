import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Delegation } from 'app/shared/model/delegation.model';
import { DelegationService } from './delegation.service';
import { DelegationComponent } from './delegation.component';
import { DelegationDetailComponent } from './delegation-detail.component';
import { DelegationUpdateComponent } from './delegation-update.component';
import { DelegationDeletePopupComponent } from './delegation-delete-dialog.component';
import { IDelegation } from 'app/shared/model/delegation.model';

@Injectable({ providedIn: 'root' })
export class DelegationResolve implements Resolve<IDelegation> {
    constructor(private service: DelegationService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IDelegation> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Delegation>) => response.ok),
                map((delegation: HttpResponse<Delegation>) => delegation.body)
            );
        }
        return of(new Delegation());
    }
}

export const delegationRoute: Routes = [
    {
        path: '',
        component: DelegationComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.delegation.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: DelegationDetailComponent,
        resolve: {
            delegation: DelegationResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.delegation.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: DelegationUpdateComponent,
        resolve: {
            delegation: DelegationResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.delegation.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: DelegationUpdateComponent,
        resolve: {
            delegation: DelegationResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.delegation.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const delegationPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: DelegationDeletePopupComponent,
        resolve: {
            delegation: DelegationResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.delegation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
