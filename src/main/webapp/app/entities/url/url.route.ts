import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Url } from 'app/shared/model/url.model';
import { UrlService } from './url.service';
import { UrlComponent } from './url.component';
import { UrlDetailComponent } from './url-detail.component';
import { UrlUpdateComponent } from './url-update.component';
import { UrlDeletePopupComponent } from './url-delete-dialog.component';
import { IUrl } from 'app/shared/model/url.model';

@Injectable({ providedIn: 'root' })
export class UrlResolve implements Resolve<IUrl> {
    constructor(private service: UrlService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IUrl> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Url>) => response.ok),
                map((url: HttpResponse<Url>) => url.body)
            );
        }
        return of(new Url());
    }
}

export const urlRoute: Routes = [
    {
        path: '',
        component: UrlComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'mallApp.url.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: UrlDetailComponent,
        resolve: {
            url: UrlResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.url.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: UrlUpdateComponent,
        resolve: {
            url: UrlResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.url.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: UrlUpdateComponent,
        resolve: {
            url: UrlResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.url.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const urlPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: UrlDeletePopupComponent,
        resolve: {
            url: UrlResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.url.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
