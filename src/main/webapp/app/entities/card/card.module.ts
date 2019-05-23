import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MallSharedModule } from 'app/shared';
import {
    CardComponent,
    CardDetailComponent,
    CardUpdateComponent,
    CardDeletePopupComponent,
    CardDeleteDialogComponent,
    cardRoute,
    cardPopupRoute
} from './';

const ENTITY_STATES = [...cardRoute, ...cardPopupRoute];

@NgModule({
    imports: [MallSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [CardComponent, CardDetailComponent, CardUpdateComponent, CardDeleteDialogComponent, CardDeletePopupComponent],
    entryComponents: [CardComponent, CardUpdateComponent, CardDeleteDialogComponent, CardDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallCardModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
