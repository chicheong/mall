import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ICard, Card } from 'app/shared/model/card.model';
import { CardService } from './card.service';
import { CardComponent } from './card.component';
import { CardDetailComponent } from './card-detail.component';
import { CardUpdateComponent } from './card-update.component';

@Injectable({ providedIn: 'root' })
export class CardResolve implements Resolve<ICard> {
  constructor(private service: CardService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICard> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((card: HttpResponse<Card>) => {
          if (card.body) {
            return of(card.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Card());
  }
}

export const cardRoute: Routes = [
  {
    path: '',
    component: CardComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'mallApp.card.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: CardDetailComponent,
    resolve: {
      card: CardResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.card.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: CardUpdateComponent,
    resolve: {
      card: CardResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.card.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: CardUpdateComponent,
    resolve: {
      card: CardResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mallApp.card.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
