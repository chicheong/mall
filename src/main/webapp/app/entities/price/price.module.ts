import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from '../../shared';
import {
    PriceService,
    PricePopupService,
    PriceComponent,
    PriceDetailComponent,
    PriceDialogComponent,
    PricePopupComponent,
    PriceDeletePopupComponent,
    PriceDeleteDialogComponent,
    priceRoute,
    pricePopupRoute,
    PriceResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...priceRoute,
    ...pricePopupRoute,
];

@NgModule({
    imports: [
        MallSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        PriceComponent,
        PriceDetailComponent,
        PriceDialogComponent,
        PriceDeleteDialogComponent,
        PricePopupComponent,
        PriceDeletePopupComponent,
    ],
    entryComponents: [
        PriceComponent,
        PriceDialogComponent,
        PricePopupComponent,
        PriceDeleteDialogComponent,
        PriceDeletePopupComponent,
    ],
    providers: [
        PriceService,
        PricePopupService,
        PriceResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallPriceModule {}
