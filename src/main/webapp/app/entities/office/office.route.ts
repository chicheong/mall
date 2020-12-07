import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IOffice, Office } from 'app/shared/model/office.model';
import { OfficeService } from './office.service';
import { OfficeComponent } from './office.component';
import { OfficeDetailComponent } from './office-detail.component';
import { OfficeUpdateComponent } from './office-update.component';

@Injectable({ providedIn: 'root' })
export class OfficeResolve implements Resolve<IOffice> {
  constructor(private service: OfficeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOffice> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((office: HttpResponse<Office>) => {
          if (office.body) {
            return of(office.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
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
      authorities: [Authority.USER],
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
      authorities: [Authority.USER],
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
      authorities: [Authority.USER],
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
      authorities: [Authority.USER],
      pageTitle: 'mallApp.office.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
