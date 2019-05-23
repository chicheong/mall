import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MallSharedModule } from 'app/shared';
import {
    PriceComponent,
    PriceDetailComponent,
    PriceUpdateComponent,
    PriceDeletePopupComponent,
    PriceDeleteDialogComponent,
    priceRoute,
    pricePopupRoute
} from './';

const ENTITY_STATES = [...priceRoute, ...pricePopupRoute];

@NgModule({
    imports: [MallSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [PriceComponent, PriceDetailComponent, PriceUpdateComponent, PriceDeleteDialogComponent, PriceDeletePopupComponent],
    entryComponents: [PriceComponent, PriceUpdateComponent, PriceDeleteDialogComponent, PriceDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallPriceModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
