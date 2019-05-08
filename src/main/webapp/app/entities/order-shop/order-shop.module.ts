import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from '../../shared';
import {
    OrderShopService,
    OrderShopPopupService,
    OrderShopComponent,
    OrderShopDetailComponent,
    OrderShopDialogComponent,
    OrderShopPopupComponent,
    OrderShopDeletePopupComponent,
    OrderShopDeleteDialogComponent,
    orderShopRoute,
    orderShopPopupRoute,
    OrderShopResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...orderShopRoute,
    ...orderShopPopupRoute,
];

@NgModule({
    imports: [
        MallSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        OrderShopComponent,
        OrderShopDetailComponent,
        OrderShopDialogComponent,
        OrderShopDeleteDialogComponent,
        OrderShopPopupComponent,
        OrderShopDeletePopupComponent,
    ],
    entryComponents: [
        OrderShopComponent,
        OrderShopDialogComponent,
        OrderShopPopupComponent,
        OrderShopDeleteDialogComponent,
        OrderShopDeletePopupComponent,
    ],
    providers: [
        OrderShopService,
        OrderShopPopupService,
        OrderShopResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallOrderShopModule {}
