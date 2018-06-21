import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from '../../shared';
import {
    ShippingTypeService,
    ShippingTypePopupService,
    ShippingTypeComponent,
    ShippingTypeDetailComponent,
    ShippingTypeDialogComponent,
    ShippingTypePopupComponent,
    ShippingTypeDeletePopupComponent,
    ShippingTypeDeleteDialogComponent,
    shippingTypeRoute,
    shippingTypePopupRoute,
    ShippingTypeResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...shippingTypeRoute,
    ...shippingTypePopupRoute,
];

@NgModule({
    imports: [
        MallSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        ShippingTypeComponent,
        ShippingTypeDetailComponent,
        ShippingTypeDialogComponent,
        ShippingTypeDeleteDialogComponent,
        ShippingTypePopupComponent,
        ShippingTypeDeletePopupComponent,
    ],
    entryComponents: [
        ShippingTypeComponent,
        ShippingTypeDialogComponent,
        ShippingTypePopupComponent,
        ShippingTypeDeleteDialogComponent,
        ShippingTypeDeletePopupComponent,
    ],
    providers: [
        ShippingTypeService,
        ShippingTypePopupService,
        ShippingTypeResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallShippingTypeModule {}
