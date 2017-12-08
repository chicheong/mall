import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from '../../shared';
import {
    DelegationService,
    DelegationPopupService,
    DelegationComponent,
    DelegationDetailComponent,
    DelegationDialogComponent,
    DelegationPopupComponent,
    DelegationDeletePopupComponent,
    DelegationDeleteDialogComponent,
    delegationRoute,
    delegationPopupRoute,
} from './';

const ENTITY_STATES = [
    ...delegationRoute,
    ...delegationPopupRoute,
];

@NgModule({
    imports: [
        MallSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        DelegationComponent,
        DelegationDetailComponent,
        DelegationDialogComponent,
        DelegationDeleteDialogComponent,
        DelegationPopupComponent,
        DelegationDeletePopupComponent,
    ],
    entryComponents: [
        DelegationComponent,
        DelegationDialogComponent,
        DelegationPopupComponent,
        DelegationDeleteDialogComponent,
        DelegationDeletePopupComponent,
    ],
    providers: [
        DelegationService,
        DelegationPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallDelegationModule {}
