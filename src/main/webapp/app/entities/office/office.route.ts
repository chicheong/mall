import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Office } from 'app/shared/model/office.model';
import { OfficeService } from './office.service';
import { OfficeComponent } from './office.component';
import { OfficeDetailComponent } from './office-detail.component';
import { OfficeUpdateComponent } from './office-update.component';
import { OfficeDeletePopupComponent } from './office-delete-dialog.component';
import { IOffice } from 'app/shared/model/office.model';

@Injectable({ providedIn: 'root' })
export class OfficeResolve implements Resolve<IOffice> {
    constructor(private service: OfficeService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IOffice> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Office>) => response.ok),
                map((office: HttpResponse<Office>) => office.body)
            );
        }
        return of(new Office());
    }
}

export const officeRoute: Routes = [
    {
        path: '',
        component: OfficeComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'mallApp.office.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: OfficeDetailComponent,
        resolve: {
            office: OfficeResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.office.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: OfficeUpdateComponent,
        resolve: {
            office: OfficeResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.office.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: OfficeUpdateComponent,
        resolve: {
            office: OfficeResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.office.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const officePopupRoute: Routes = [
    {
        path: ':id/delete',
        component: OfficeDeletePopupComponent,
        resolve: {
            office: OfficeResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.office.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
