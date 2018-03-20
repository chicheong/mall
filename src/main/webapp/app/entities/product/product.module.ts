import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { MallSharedModule } from '../../shared';
import {
    ProductService,
    ProductPopupService,
    ProductItemsPopupService,
    PricesPopupService,
    QuantitiesPopupService,
    FileUploadPopupService,
    ProductComponent,
    ProductDetailComponent,
    ProductDialogComponent,
    ProductPopupComponent,
    ProductDeletePopupComponent,
    ProductDeleteDialogComponent,
    ProductItemsDialogComponent,
    PricesDialogComponent,
    QuantitiesDialogComponent,
    FileUploadDialogComponent,
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
        PricesDialogComponent,
        QuantitiesDialogComponent,
        FileUploadDialogComponent,
        GetItemFromColorSizePipe,
    ],
    entryComponents: [
        ProductComponent,
        ProductDialogComponent,
        ProductPopupComponent,
        ProductDeleteDialogComponent,
        ProductDeletePopupComponent,
        ProductItemsDialogComponent,
        PricesDialogComponent,
        QuantitiesDialogComponent,
        FileUploadDialogComponent,
    ],
    providers: [
        ProductService,
        ProductPopupService,
        ProductResolvePagingParams,
        ProductItemsPopupService,
        PricesPopupService,
        QuantitiesPopupService,
        FileUploadPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallProductModule {}
