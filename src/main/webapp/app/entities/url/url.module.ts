import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from '../../shared';
import {
    UrlService,
    UrlPopupService,
    UrlComponent,
    UrlDetailComponent,
    UrlDialogComponent,
    UrlPopupComponent,
    UrlDeletePopupComponent,
    UrlDeleteDialogComponent,
    urlRoute,
    urlPopupRoute,
    UrlResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...urlRoute,
    ...urlPopupRoute,
];

@NgModule({
    imports: [
        MallSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        UrlComponent,
        UrlDetailComponent,
        UrlDialogComponent,
        UrlDeleteDialogComponent,
        UrlPopupComponent,
        UrlDeletePopupComponent,
    ],
    entryComponents: [
        UrlComponent,
        UrlDialogComponent,
        UrlPopupComponent,
        UrlDeleteDialogComponent,
        UrlDeletePopupComponent,
    ],
    providers: [
        UrlService,
        UrlPopupService,
        UrlResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallUrlModule {}
