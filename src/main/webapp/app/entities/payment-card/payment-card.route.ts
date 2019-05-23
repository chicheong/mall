import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { PaymentCard } from 'app/shared/model/payment-card.model';
import { PaymentCardService } from './payment-card.service';
import { PaymentCardComponent } from './payment-card.component';
import { PaymentCardDetailComponent } from './payment-card-detail.component';
import { PaymentCardUpdateComponent } from './payment-card-update.component';
import { PaymentCardDeletePopupComponent } from './payment-card-delete-dialog.component';
import { IPaymentCard } from 'app/shared/model/payment-card.model';

@Injectable({ providedIn: 'root' })
export class PaymentCardResolve implements Resolve<IPaymentCard> {
    constructor(private service: PaymentCardService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPaymentCard> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<PaymentCard>) => response.ok),
                map((paymentCard: HttpResponse<PaymentCard>) => paymentCard.body)
            );
        }
        return of(new PaymentCard());
    }
}

export const paymentCardRoute: Routes = [
    {
        path: '',
        component: PaymentCardComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'mallApp.paymentCard.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: PaymentCardDetailComponent,
        resolve: {
            paymentCard: PaymentCardResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.paymentCard.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: PaymentCardUpdateComponent,
        resolve: {
            paymentCard: PaymentCardResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.paymentCard.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: PaymentCardUpdateComponent,
        resolve: {
            paymentCard: PaymentCardResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.paymentCard.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const paymentCardPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: PaymentCardDeletePopupComponent,
        resolve: {
            paymentCard: PaymentCardResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.paymentCard.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
