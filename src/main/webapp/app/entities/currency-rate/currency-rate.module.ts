import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MallSharedModule } from 'app/shared';
import {
    CurrencyRateComponent,
    CurrencyRateDetailComponent,
    CurrencyRateUpdateComponent,
    CurrencyRateDeletePopupComponent,
    CurrencyRateDeleteDialogComponent,
    currencyRateRoute,
    currencyRatePopupRoute
} from './';

const ENTITY_STATES = [...currencyRateRoute, ...currencyRatePopupRoute];

@NgModule({
    imports: [MallSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        CurrencyRateComponent,
        CurrencyRateDetailComponent,
        CurrencyRateUpdateComponent,
        CurrencyRateDeleteDialogComponent,
        CurrencyRateDeletePopupComponent
    ],
    entryComponents: [
        CurrencyRateComponent,
        CurrencyRateUpdateComponent,
        CurrencyRateDeleteDialogComponent,
        CurrencyRateDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallCurrencyRateModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
