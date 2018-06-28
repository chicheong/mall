import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from '../../shared';
import {
    PaymentStatusHistoryService,
    PaymentStatusHistoryPopupService,
    PaymentStatusHistoryComponent,
    PaymentStatusHistoryDetailComponent,
    PaymentStatusHistoryDialogComponent,
    PaymentStatusHistoryPopupComponent,
    PaymentStatusHistoryDeletePopupComponent,
    PaymentStatusHistoryDeleteDialogComponent,
    paymentStatusHistoryRoute,
    paymentStatusHistoryPopupRoute,
} from './';

const ENTITY_STATES = [
    ...paymentStatusHistoryRoute,
    ...paymentStatusHistoryPopupRoute,
];

@NgModule({
    imports: [
        MallSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        PaymentStatusHistoryComponent,
        PaymentStatusHistoryDetailComponent,
        PaymentStatusHistoryDialogComponent,
        PaymentStatusHistoryDeleteDialogComponent,
        PaymentStatusHistoryPopupComponent,
        PaymentStatusHistoryDeletePopupComponent,
    ],
    entryComponents: [
        PaymentStatusHistoryComponent,
        PaymentStatusHistoryDialogComponent,
        PaymentStatusHistoryPopupComponent,
        PaymentStatusHistoryDeleteDialogComponent,
        PaymentStatusHistoryDeletePopupComponent,
    ],
    providers: [
        PaymentStatusHistoryService,
        PaymentStatusHistoryPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallPaymentStatusHistoryModule {}
