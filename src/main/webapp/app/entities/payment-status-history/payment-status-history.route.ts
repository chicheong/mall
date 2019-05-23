import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { PaymentStatusHistory } from 'app/shared/model/payment-status-history.model';
import { PaymentStatusHistoryService } from './payment-status-history.service';
import { PaymentStatusHistoryComponent } from './payment-status-history.component';
import { PaymentStatusHistoryDetailComponent } from './payment-status-history-detail.component';
import { PaymentStatusHistoryUpdateComponent } from './payment-status-history-update.component';
import { PaymentStatusHistoryDeletePopupComponent } from './payment-status-history-delete-dialog.component';
import { IPaymentStatusHistory } from 'app/shared/model/payment-status-history.model';

@Injectable({ providedIn: 'root' })
export class PaymentStatusHistoryResolve implements Resolve<IPaymentStatusHistory> {
    constructor(private service: PaymentStatusHistoryService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPaymentStatusHistory> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<PaymentStatusHistory>) => response.ok),
                map((paymentStatusHistory: HttpResponse<PaymentStatusHistory>) => paymentStatusHistory.body)
            );
        }
        return of(new PaymentStatusHistory());
    }
}

export const paymentStatusHistoryRoute: Routes = [
    {
        path: '',
        component: PaymentStatusHistoryComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.paymentStatusHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: PaymentStatusHistoryDetailComponent,
        resolve: {
            paymentStatusHistory: PaymentStatusHistoryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.paymentStatusHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: PaymentStatusHistoryUpdateComponent,
        resolve: {
            paymentStatusHistory: PaymentStatusHistoryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.paymentStatusHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: PaymentStatusHistoryUpdateComponent,
        resolve: {
            paymentStatusHistory: PaymentStatusHistoryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.paymentStatusHistory.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const paymentStatusHistoryPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: PaymentStatusHistoryDeletePopupComponent,
        resolve: {
            paymentStatusHistory: PaymentStatusHistoryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'mallApp.paymentStatusHistory.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
