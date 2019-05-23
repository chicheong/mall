import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MallSharedModule } from 'app/shared';
import {
    ProductStyleHistoryComponent,
    ProductStyleHistoryDetailComponent,
    ProductStyleHistoryUpdateComponent,
    ProductStyleHistoryDeletePopupComponent,
    ProductStyleHistoryDeleteDialogComponent,
    productStyleHistoryRoute,
    productStyleHistoryPopupRoute
} from './';

const ENTITY_STATES = [...productStyleHistoryRoute, ...productStyleHistoryPopupRoute];

@NgModule({
    imports: [MallSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ProductStyleHistoryComponent,
        ProductStyleHistoryDetailComponent,
        ProductStyleHistoryUpdateComponent,
        ProductStyleHistoryDeleteDialogComponent,
        ProductStyleHistoryDeletePopupComponent
    ],
    entryComponents: [
        ProductStyleHistoryComponent,
        ProductStyleHistoryUpdateComponent,
        ProductStyleHistoryDeleteDialogComponent,
        ProductStyleHistoryDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallProductStyleHistoryModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
