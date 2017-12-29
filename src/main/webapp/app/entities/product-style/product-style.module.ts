import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from '../../shared';
import {
    ProductStyleService,
    ProductStylePopupService,
    ProductStyleComponent,
    ProductStyleDetailComponent,
    ProductStyleDialogComponent,
    ProductStylePopupComponent,
    ProductStyleDeletePopupComponent,
    ProductStyleDeleteDialogComponent,
    productStyleRoute,
    productStylePopupRoute,
} from './';

const ENTITY_STATES = [
    ...productStyleRoute,
    ...productStylePopupRoute,
];

@NgModule({
    imports: [
        MallSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        ProductStyleComponent,
        ProductStyleDetailComponent,
        ProductStyleDialogComponent,
        ProductStyleDeleteDialogComponent,
        ProductStylePopupComponent,
        ProductStyleDeletePopupComponent,
    ],
    entryComponents: [
        ProductStyleComponent,
        ProductStyleDialogComponent,
        ProductStylePopupComponent,
        ProductStyleDeleteDialogComponent,
        ProductStyleDeletePopupComponent,
    ],
    providers: [
        ProductStyleService,
        ProductStylePopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallProductStyleModule {}
