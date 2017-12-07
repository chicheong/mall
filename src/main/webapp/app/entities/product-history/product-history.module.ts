import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from '../../shared';
import {
    ProductHistoryService,
    ProductHistoryPopupService,
    ProductHistoryComponent,
    ProductHistoryDetailComponent,
    ProductHistoryDialogComponent,
    ProductHistoryPopupComponent,
    ProductHistoryDeletePopupComponent,
    ProductHistoryDeleteDialogComponent,
    productHistoryRoute,
    productHistoryPopupRoute,
} from './';

const ENTITY_STATES = [
    ...productHistoryRoute,
    ...productHistoryPopupRoute,
];

@NgModule({
    imports: [
        MallSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        ProductHistoryComponent,
        ProductHistoryDetailComponent,
        ProductHistoryDialogComponent,
        ProductHistoryDeleteDialogComponent,
        ProductHistoryPopupComponent,
        ProductHistoryDeletePopupComponent,
    ],
    entryComponents: [
        ProductHistoryComponent,
        ProductHistoryDialogComponent,
        ProductHistoryPopupComponent,
        ProductHistoryDeleteDialogComponent,
        ProductHistoryDeletePopupComponent,
    ],
    providers: [
        ProductHistoryService,
        ProductHistoryPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallProductHistoryModule {}
