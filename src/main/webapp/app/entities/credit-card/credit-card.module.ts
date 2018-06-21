import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from '../../shared';
import {
    CreditCardService,
    CreditCardPopupService,
    CreditCardComponent,
    CreditCardDetailComponent,
    CreditCardDialogComponent,
    CreditCardPopupComponent,
    CreditCardDeletePopupComponent,
    CreditCardDeleteDialogComponent,
    creditCardRoute,
    creditCardPopupRoute,
    CreditCardResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...creditCardRoute,
    ...creditCardPopupRoute,
];

@NgModule({
    imports: [
        MallSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        CreditCardComponent,
        CreditCardDetailComponent,
        CreditCardDialogComponent,
        CreditCardDeleteDialogComponent,
        CreditCardPopupComponent,
        CreditCardDeletePopupComponent,
    ],
    entryComponents: [
        CreditCardComponent,
        CreditCardDialogComponent,
        CreditCardPopupComponent,
        CreditCardDeleteDialogComponent,
        CreditCardDeletePopupComponent,
    ],
    providers: [
        CreditCardService,
        CreditCardPopupService,
        CreditCardResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallCreditCardModule {}
