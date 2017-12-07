import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from '../../shared';
import {
    ProductItemService,
    ProductItemPopupService,
    ProductItemComponent,
    ProductItemDetailComponent,
    ProductItemDialogComponent,
    ProductItemPopupComponent,
    ProductItemDeletePopupComponent,
    ProductItemDeleteDialogComponent,
    productItemRoute,
    productItemPopupRoute,
    ProductItemResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...productItemRoute,
    ...productItemPopupRoute,
];

@NgModule({
    imports: [
        MallSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        ProductItemComponent,
        ProductItemDetailComponent,
        ProductItemDialogComponent,
        ProductItemDeleteDialogComponent,
        ProductItemPopupComponent,
        ProductItemDeletePopupComponent,
    ],
    entryComponents: [
        ProductItemComponent,
        ProductItemDialogComponent,
        ProductItemPopupComponent,
        ProductItemDeleteDialogComponent,
        ProductItemDeletePopupComponent,
    ],
    providers: [
        ProductItemService,
        ProductItemPopupService,
        ProductItemResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallProductItemModule {}
