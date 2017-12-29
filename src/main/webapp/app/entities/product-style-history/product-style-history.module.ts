import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from '../../shared';
import {
    ProductStyleHistoryService,
    ProductStyleHistoryPopupService,
    ProductStyleHistoryComponent,
    ProductStyleHistoryDetailComponent,
    ProductStyleHistoryDialogComponent,
    ProductStyleHistoryPopupComponent,
    ProductStyleHistoryDeletePopupComponent,
    ProductStyleHistoryDeleteDialogComponent,
    productStyleHistoryRoute,
    productStyleHistoryPopupRoute,
} from './';

const ENTITY_STATES = [
    ...productStyleHistoryRoute,
    ...productStyleHistoryPopupRoute,
];

@NgModule({
    imports: [
        MallSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        ProductStyleHistoryComponent,
        ProductStyleHistoryDetailComponent,
        ProductStyleHistoryDialogComponent,
        ProductStyleHistoryDeleteDialogComponent,
        ProductStyleHistoryPopupComponent,
        ProductStyleHistoryDeletePopupComponent,
    ],
    entryComponents: [
        ProductStyleHistoryComponent,
        ProductStyleHistoryDialogComponent,
        ProductStyleHistoryPopupComponent,
        ProductStyleHistoryDeleteDialogComponent,
        ProductStyleHistoryDeletePopupComponent,
    ],
    providers: [
        ProductStyleHistoryService,
        ProductStyleHistoryPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallProductStyleHistoryModule {}
