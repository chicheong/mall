import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MallSharedModule } from 'app/shared';
import {
    ProductHistoryComponent,
    ProductHistoryDetailComponent,
    ProductHistoryUpdateComponent,
    ProductHistoryDeletePopupComponent,
    ProductHistoryDeleteDialogComponent,
    productHistoryRoute,
    productHistoryPopupRoute
} from './';

const ENTITY_STATES = [...productHistoryRoute, ...productHistoryPopupRoute];

@NgModule({
    imports: [MallSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ProductHistoryComponent,
        ProductHistoryDetailComponent,
        ProductHistoryUpdateComponent,
        ProductHistoryDeleteDialogComponent,
        ProductHistoryDeletePopupComponent
    ],
    entryComponents: [
        ProductHistoryComponent,
        ProductHistoryUpdateComponent,
        ProductHistoryDeleteDialogComponent,
        ProductHistoryDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallProductHistoryModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
