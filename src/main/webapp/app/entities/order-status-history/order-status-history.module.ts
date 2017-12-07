import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from '../../shared';
import {
    OrderStatusHistoryService,
    OrderStatusHistoryPopupService,
    OrderStatusHistoryComponent,
    OrderStatusHistoryDetailComponent,
    OrderStatusHistoryDialogComponent,
    OrderStatusHistoryPopupComponent,
    OrderStatusHistoryDeletePopupComponent,
    OrderStatusHistoryDeleteDialogComponent,
    orderStatusHistoryRoute,
    orderStatusHistoryPopupRoute,
} from './';

const ENTITY_STATES = [
    ...orderStatusHistoryRoute,
    ...orderStatusHistoryPopupRoute,
];

@NgModule({
    imports: [
        MallSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        OrderStatusHistoryComponent,
        OrderStatusHistoryDetailComponent,
        OrderStatusHistoryDialogComponent,
        OrderStatusHistoryDeleteDialogComponent,
        OrderStatusHistoryPopupComponent,
        OrderStatusHistoryDeletePopupComponent,
    ],
    entryComponents: [
        OrderStatusHistoryComponent,
        OrderStatusHistoryDialogComponent,
        OrderStatusHistoryPopupComponent,
        OrderStatusHistoryDeleteDialogComponent,
        OrderStatusHistoryDeletePopupComponent,
    ],
    providers: [
        OrderStatusHistoryService,
        OrderStatusHistoryPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallOrderStatusHistoryModule {}
