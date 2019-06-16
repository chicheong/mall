import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MallSharedModule } from 'app/shared';
import {
    MyStateComponent,
    MyStateDetailComponent,
    MyStateUpdateComponent,
    MyStateDeletePopupComponent,
    MyStateDeleteDialogComponent,
    myStateRoute,
    myStatePopupRoute
} from './';

const ENTITY_STATES = [...myStateRoute, ...myStatePopupRoute];

@NgModule({
    imports: [MallSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        MyStateComponent,
        MyStateDetailComponent,
        MyStateUpdateComponent,
        MyStateDeleteDialogComponent,
        MyStateDeletePopupComponent
    ],
    entryComponents: [MyStateComponent, MyStateUpdateComponent, MyStateDeleteDialogComponent, MyStateDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallMyStateModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
