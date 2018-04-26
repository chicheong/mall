import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from '../../shared';
import {
    MyOrderService,
    MyOrderPopupService,
    MyOrderComponent,
    MyOrderDetailComponent,
    MyOrderDialogComponent,
    MyOrderPopupComponent,
    MyOrderDeletePopupComponent,
    MyOrderDeleteDialogComponent,
    CheckoutComponent,
    myOrderRoute,
    myOrderPopupRoute,
    MyOrderResolvePagingParams,
} from './';

import { CheckoutControlComponent } from './checkout-control/checkout-control.component';
import { CheckoutSummaryComponent } from './checkout-summary/checkout-summary.component';

const ENTITY_STATES = [
    ...myOrderRoute,
    ...myOrderPopupRoute,
];

@NgModule({
    imports: [
        MallSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        MyOrderComponent,
        MyOrderDetailComponent,
        MyOrderDialogComponent,
        MyOrderDeleteDialogComponent,
        MyOrderPopupComponent,
        MyOrderDeletePopupComponent,
        CheckoutComponent,
        CheckoutControlComponent,
        CheckoutSummaryComponent,
    ],
    entryComponents: [
        MyOrderComponent,
        MyOrderDialogComponent,
        MyOrderPopupComponent,
        MyOrderDeleteDialogComponent,
        MyOrderDeletePopupComponent,
        CheckoutComponent,
        CheckoutControlComponent,
        CheckoutSummaryComponent,
    ],
    providers: [
        MyOrderService,
        MyOrderPopupService,
        MyOrderResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallMyOrderModule {}
