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
    ],
    entryComponents: [
        MyOrderComponent,
        MyOrderDialogComponent,
        MyOrderPopupComponent,
        MyOrderDeleteDialogComponent,
        MyOrderDeletePopupComponent,
        CheckoutComponent,
    ],
    providers: [
        MyOrderService,
        MyOrderPopupService,
        MyOrderResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallMyOrderModule {}
