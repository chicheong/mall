import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from '../../shared';
import {
    ShippingStatusHistoryService,
    ShippingStatusHistoryPopupService,
    ShippingStatusHistoryComponent,
    ShippingStatusHistoryDetailComponent,
    ShippingStatusHistoryDialogComponent,
    ShippingStatusHistoryPopupComponent,
    ShippingStatusHistoryDeletePopupComponent,
    ShippingStatusHistoryDeleteDialogComponent,
    shippingStatusHistoryRoute,
    shippingStatusHistoryPopupRoute,
} from './';

const ENTITY_STATES = [
    ...shippingStatusHistoryRoute,
    ...shippingStatusHistoryPopupRoute,
];

@NgModule({
    imports: [
        MallSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        ShippingStatusHistoryComponent,
        ShippingStatusHistoryDetailComponent,
        ShippingStatusHistoryDialogComponent,
        ShippingStatusHistoryDeleteDialogComponent,
        ShippingStatusHistoryPopupComponent,
        ShippingStatusHistoryDeletePopupComponent,
    ],
    entryComponents: [
        ShippingStatusHistoryComponent,
        ShippingStatusHistoryDialogComponent,
        ShippingStatusHistoryPopupComponent,
        ShippingStatusHistoryDeleteDialogComponent,
        ShippingStatusHistoryDeletePopupComponent,
    ],
    providers: [
        ShippingStatusHistoryService,
        ShippingStatusHistoryPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallShippingStatusHistoryModule {}
