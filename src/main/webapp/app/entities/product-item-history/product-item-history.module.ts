import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from '../../shared';
import {
    ProductItemHistoryService,
    ProductItemHistoryPopupService,
    ProductItemHistoryComponent,
    ProductItemHistoryDetailComponent,
    ProductItemHistoryDialogComponent,
    ProductItemHistoryPopupComponent,
    ProductItemHistoryDeletePopupComponent,
    ProductItemHistoryDeleteDialogComponent,
    productItemHistoryRoute,
    productItemHistoryPopupRoute,
} from './';

const ENTITY_STATES = [
    ...productItemHistoryRoute,
    ...productItemHistoryPopupRoute,
];

@NgModule({
    imports: [
        MallSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        ProductItemHistoryComponent,
        ProductItemHistoryDetailComponent,
        ProductItemHistoryDialogComponent,
        ProductItemHistoryDeleteDialogComponent,
        ProductItemHistoryPopupComponent,
        ProductItemHistoryDeletePopupComponent,
    ],
    entryComponents: [
        ProductItemHistoryComponent,
        ProductItemHistoryDialogComponent,
        ProductItemHistoryPopupComponent,
        ProductItemHistoryDeleteDialogComponent,
        ProductItemHistoryDeletePopupComponent,
    ],
    providers: [
        ProductItemHistoryService,
        ProductItemHistoryPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallProductItemHistoryModule {}
