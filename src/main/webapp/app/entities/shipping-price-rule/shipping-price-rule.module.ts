import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from '../../shared';
import {
    ShippingPriceRuleService,
    ShippingPriceRulePopupService,
    ShippingPriceRuleComponent,
    ShippingPriceRuleDetailComponent,
    ShippingPriceRuleDialogComponent,
    ShippingPriceRulePopupComponent,
    ShippingPriceRuleDeletePopupComponent,
    ShippingPriceRuleDeleteDialogComponent,
    shippingPriceRuleRoute,
    shippingPriceRulePopupRoute,
    ShippingPriceRuleResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...shippingPriceRuleRoute,
    ...shippingPriceRulePopupRoute,
];

@NgModule({
    imports: [
        MallSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        ShippingPriceRuleComponent,
        ShippingPriceRuleDetailComponent,
        ShippingPriceRuleDialogComponent,
        ShippingPriceRuleDeleteDialogComponent,
        ShippingPriceRulePopupComponent,
        ShippingPriceRuleDeletePopupComponent,
    ],
    entryComponents: [
        ShippingPriceRuleComponent,
        ShippingPriceRuleDialogComponent,
        ShippingPriceRulePopupComponent,
        ShippingPriceRuleDeleteDialogComponent,
        ShippingPriceRuleDeletePopupComponent,
    ],
    providers: [
        ShippingPriceRuleService,
        ShippingPriceRulePopupService,
        ShippingPriceRuleResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallShippingPriceRuleModule {}
