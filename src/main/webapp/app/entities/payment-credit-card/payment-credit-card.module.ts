import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from '../../shared';
import {
    PaymentCreditCardService,
    PaymentCreditCardPopupService,
    PaymentCreditCardComponent,
    PaymentCreditCardDetailComponent,
    PaymentCreditCardDialogComponent,
    PaymentCreditCardPopupComponent,
    PaymentCreditCardDeletePopupComponent,
    PaymentCreditCardDeleteDialogComponent,
    paymentCreditCardRoute,
    paymentCreditCardPopupRoute,
    PaymentCreditCardResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...paymentCreditCardRoute,
    ...paymentCreditCardPopupRoute,
];

@NgModule({
    imports: [
        MallSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        PaymentCreditCardComponent,
        PaymentCreditCardDetailComponent,
        PaymentCreditCardDialogComponent,
        PaymentCreditCardDeleteDialogComponent,
        PaymentCreditCardPopupComponent,
        PaymentCreditCardDeletePopupComponent,
    ],
    entryComponents: [
        PaymentCreditCardComponent,
        PaymentCreditCardDialogComponent,
        PaymentCreditCardPopupComponent,
        PaymentCreditCardDeleteDialogComponent,
        PaymentCreditCardDeletePopupComponent,
    ],
    providers: [
        PaymentCreditCardService,
        PaymentCreditCardPopupService,
        PaymentCreditCardResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallPaymentCreditCardModule {}
