import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from '../../shared';
import {
    MyAccountService,
    MyAccountPopupService,
    MyAccountComponent,
    MyAccountDetailComponent,
    MyAccountDialogComponent,
    MyAccountPopupComponent,
    MyAccountDeletePopupComponent,
    MyAccountDeleteDialogComponent,
    myAccountRoute,
    myAccountPopupRoute,
    MyAccountResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...myAccountRoute,
    ...myAccountPopupRoute,
];

@NgModule({
    imports: [
        MallSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        MyAccountComponent,
        MyAccountDetailComponent,
        MyAccountDialogComponent,
        MyAccountDeleteDialogComponent,
        MyAccountPopupComponent,
        MyAccountDeletePopupComponent,
    ],
    entryComponents: [
        MyAccountComponent,
        MyAccountDialogComponent,
        MyAccountPopupComponent,
        MyAccountDeleteDialogComponent,
        MyAccountDeletePopupComponent,
    ],
    providers: [
        MyAccountService,
        MyAccountPopupService,
        MyAccountResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallMyAccountModule {}
