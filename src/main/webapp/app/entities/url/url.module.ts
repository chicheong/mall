import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MallSharedModule } from 'app/shared';
import {
    UrlComponent,
    UrlDetailComponent,
    UrlUpdateComponent,
    UrlDeletePopupComponent,
    UrlDeleteDialogComponent,
    urlRoute,
    urlPopupRoute
} from './';

const ENTITY_STATES = [...urlRoute, ...urlPopupRoute];

@NgModule({
    imports: [MallSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [UrlComponent, UrlDetailComponent, UrlUpdateComponent, UrlDeleteDialogComponent, UrlDeletePopupComponent],
    entryComponents: [UrlComponent, UrlUpdateComponent, UrlDeleteDialogComponent, UrlDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallUrlModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
