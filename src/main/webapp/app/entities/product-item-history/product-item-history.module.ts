import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MallSharedModule } from 'app/shared';
import {
    ProductItemHistoryComponent,
    ProductItemHistoryDetailComponent,
    ProductItemHistoryUpdateComponent,
    ProductItemHistoryDeletePopupComponent,
    ProductItemHistoryDeleteDialogComponent,
    productItemHistoryRoute,
    productItemHistoryPopupRoute
} from './';

const ENTITY_STATES = [...productItemHistoryRoute, ...productItemHistoryPopupRoute];

@NgModule({
    imports: [MallSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ProductItemHistoryComponent,
        ProductItemHistoryDetailComponent,
        ProductItemHistoryUpdateComponent,
        ProductItemHistoryDeleteDialogComponent,
        ProductItemHistoryDeletePopupComponent
    ],
    entryComponents: [
        ProductItemHistoryComponent,
        ProductItemHistoryUpdateComponent,
        ProductItemHistoryDeleteDialogComponent,
        ProductItemHistoryDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallProductItemHistoryModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
