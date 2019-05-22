import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { MallSharedModule } from '../../shared';
import {
    ProductService,
    ProductPopupService,
    ProductDetailPopupService,
    PricesPopupService,
    QuantitiesPopupService,
    ProductComponent,
    ProductDetailComponent,
    ProductDialogComponent,
    ProductPopupComponent,
    ProductDeletePopupComponent,
    ProductDeleteDialogComponent,
    ProductItemsDialogComponent,
    ProductItemsUrlDialogComponent,
    PricesDialogComponent,
    QuantitiesDialogComponent,
    ProductDetailOtherDialogComponent,
    productRoute,
    productPopupRoute,
    ProductResolvePagingParams,
    GetItemFromColorSizePipe,
} from './';

const ENTITY_STATES = [
    ...productRoute,
    ...productPopupRoute,
];

@NgModule({
    imports: [
        MallSharedModule,
        ReactiveFormsModule,
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
        ProductItemsUrlDialogComponent,
        PricesDialogComponent,
        QuantitiesDialogComponent,
        GetItemFromColorSizePipe,
        ProductDetailOtherDialogComponent,
    ],
    entryComponents: [
        ProductComponent,
        ProductDialogComponent,
        ProductPopupComponent,
        ProductDeleteDialogComponent,
        ProductDeletePopupComponent,
        ProductItemsDialogComponent,
        ProductItemsUrlDialogComponent,
        PricesDialogComponent,
        QuantitiesDialogComponent,
        ProductDetailOtherDialogComponent,
    ],
    providers: [
        ProductService,
        ProductPopupService,
        ProductResolvePagingParams,
        ProductDetailPopupService,
        PricesPopupService,
        QuantitiesPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallProductModule {}
