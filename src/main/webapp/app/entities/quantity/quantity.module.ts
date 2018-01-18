import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from '../../shared';
import {
    QuantityService,
    QuantityPopupService,
    QuantityComponent,
    QuantityDetailComponent,
    QuantityDialogComponent,
    QuantityPopupComponent,
    QuantityDeletePopupComponent,
    QuantityDeleteDialogComponent,
    quantityRoute,
    quantityPopupRoute,
    QuantityResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...quantityRoute,
    ...quantityPopupRoute,
];

@NgModule({
    imports: [
        MallSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        QuantityComponent,
        QuantityDetailComponent,
        QuantityDialogComponent,
        QuantityDeleteDialogComponent,
        QuantityPopupComponent,
        QuantityDeletePopupComponent,
    ],
    entryComponents: [
        QuantityComponent,
        QuantityDialogComponent,
        QuantityPopupComponent,
        QuantityDeleteDialogComponent,
        QuantityDeletePopupComponent,
    ],
    providers: [
        QuantityService,
        QuantityPopupService,
        QuantityResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallQuantityModule {}
