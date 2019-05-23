import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MallSharedModule } from 'app/shared';
import {
    MyAccountComponent,
    MyAccountDetailComponent,
    MyAccountUpdateComponent,
    MyAccountDeletePopupComponent,
    MyAccountDeleteDialogComponent,
    myAccountRoute,
    myAccountPopupRoute
} from './';

const ENTITY_STATES = [...myAccountRoute, ...myAccountPopupRoute];

@NgModule({
    imports: [MallSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        MyAccountComponent,
        MyAccountDetailComponent,
        MyAccountUpdateComponent,
        MyAccountDeleteDialogComponent,
        MyAccountDeletePopupComponent
    ],
    entryComponents: [MyAccountComponent, MyAccountUpdateComponent, MyAccountDeleteDialogComponent, MyAccountDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallMyAccountModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
