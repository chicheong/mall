import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MallSharedModule } from 'app/shared';
import {
    StateComponent,
    StateDetailComponent,
    StateUpdateComponent,
    StateDeletePopupComponent,
    StateDeleteDialogComponent,
    stateRoute,
    statePopupRoute
} from './';

const ENTITY_STATES = [...stateRoute, ...statePopupRoute];

@NgModule({
    imports: [MallSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [StateComponent, StateDetailComponent, StateUpdateComponent, StateDeleteDialogComponent, StateDeletePopupComponent],
    entryComponents: [StateComponent, StateUpdateComponent, StateDeleteDialogComponent, StateDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallStateModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
