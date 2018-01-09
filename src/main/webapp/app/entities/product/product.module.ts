import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from '../../shared';
import {
    ProductService,
    ProductPopupService,
    ProductItemsPopupService,
    ProductComponent,
    ProductDetailComponent,
    ProductDialogComponent,
    ProductPopupComponent,
    ProductDeletePopupComponent,
    ProductDeleteDialogComponent,
    ProductItemsDialogComponent,
    productRoute,
    productPopupRoute,
    ProductResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...productRoute,
    ...productPopupRoute,
];

@NgModule({
    imports: [
        MallSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        ProductComponent,
        ProductDetailComponent,
        ProductDialogComponent,
        ProductDeleteDialogComponent,
        ProductPopupComponent,
        ProductDeletePopupComponent,
        ProductItemsDialogComponent,
    ],
    entryComponents: [
        ProductComponent,
        ProductDialogComponent,
        ProductPopupComponent,
        ProductDeleteDialogComponent,
        ProductDeletePopupComponent,
        ProductItemsDialogComponent,
    ],
    providers: [
        ProductService,
        ProductPopupService,
        ProductResolvePagingParams,
        ProductItemsPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallProductModule {}
