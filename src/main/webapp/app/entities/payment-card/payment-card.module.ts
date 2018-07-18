import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from '../../shared';
import {
    PaymentCardService,
    PaymentCardPopupService,
    PaymentCardComponent,
    PaymentCardDetailComponent,
    PaymentCardDialogComponent,
    PaymentCardPopupComponent,
    PaymentCardDeletePopupComponent,
    PaymentCardDeleteDialogComponent,
    paymentCardRoute,
    paymentCardPopupRoute,
    PaymentCardResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...paymentCardRoute,
    ...paymentCardPopupRoute,
];

@NgModule({
    imports: [
        MallSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        PaymentCardComponent,
        PaymentCardDetailComponent,
        PaymentCardDialogComponent,
        PaymentCardDeleteDialogComponent,
        PaymentCardPopupComponent,
        PaymentCardDeletePopupComponent,
    ],
    entryComponents: [
        PaymentCardComponent,
        PaymentCardDialogComponent,
        PaymentCardPopupComponent,
        PaymentCardDeleteDialogComponent,
        PaymentCardDeletePopupComponent,
    ],
    providers: [
        PaymentCardService,
        PaymentCardPopupService,
        PaymentCardResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallPaymentCardModule {}
