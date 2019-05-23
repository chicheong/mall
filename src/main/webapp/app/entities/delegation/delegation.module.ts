import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MallSharedModule } from 'app/shared';
import {
    DelegationComponent,
    DelegationDetailComponent,
    DelegationUpdateComponent,
    DelegationDeletePopupComponent,
    DelegationDeleteDialogComponent,
    delegationRoute,
    delegationPopupRoute
} from './';

const ENTITY_STATES = [...delegationRoute, ...delegationPopupRoute];

@NgModule({
    imports: [MallSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        DelegationComponent,
        DelegationDetailComponent,
        DelegationUpdateComponent,
        DelegationDeleteDialogComponent,
        DelegationDeletePopupComponent
    ],
    entryComponents: [DelegationComponent, DelegationUpdateComponent, DelegationDeleteDialogComponent, DelegationDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallDelegationModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
