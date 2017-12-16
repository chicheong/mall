import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from '../../shared';
import {
    OfficeService,
    OfficePopupService,
    OfficeComponent,
    OfficeDetailComponent,
    OfficeDialogComponent,
    OfficePopupComponent,
    OfficeDeletePopupComponent,
    OfficeDeleteDialogComponent,
    officeRoute,
    officePopupRoute,
    OfficeResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...officeRoute,
    ...officePopupRoute,
];

@NgModule({
    imports: [
        MallSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        OfficeComponent,
        OfficeDetailComponent,
        OfficeDialogComponent,
        OfficeDeleteDialogComponent,
        OfficePopupComponent,
        OfficeDeletePopupComponent,
    ],
    entryComponents: [
        OfficeComponent,
        OfficeDialogComponent,
        OfficePopupComponent,
        OfficeDeleteDialogComponent,
        OfficeDeletePopupComponent,
    ],
    providers: [
        OfficeService,
        OfficePopupService,
        OfficeResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallOfficeModule {}
