import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from '../../shared';
import {
    CurrencyRateService,
    CurrencyRatePopupService,
    CurrencyRateComponent,
    CurrencyRateDetailComponent,
    CurrencyRateDialogComponent,
    CurrencyRatePopupComponent,
    CurrencyRateDeletePopupComponent,
    CurrencyRateDeleteDialogComponent,
    currencyRateRoute,
    currencyRatePopupRoute,
} from './';

const ENTITY_STATES = [
    ...currencyRateRoute,
    ...currencyRatePopupRoute,
];

@NgModule({
    imports: [
        MallSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        CurrencyRateComponent,
        CurrencyRateDetailComponent,
        CurrencyRateDialogComponent,
        CurrencyRateDeleteDialogComponent,
        CurrencyRatePopupComponent,
        CurrencyRateDeletePopupComponent,
    ],
    entryComponents: [
        CurrencyRateComponent,
        CurrencyRateDialogComponent,
        CurrencyRatePopupComponent,
        CurrencyRateDeleteDialogComponent,
        CurrencyRateDeletePopupComponent,
    ],
    providers: [
        CurrencyRateService,
        CurrencyRatePopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallCurrencyRateModule {}
