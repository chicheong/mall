import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MallSharedModule } from 'app/shared';
import {
    ShippingPriceRuleComponent,
    ShippingPriceRuleDetailComponent,
    ShippingPriceRuleUpdateComponent,
    ShippingPriceRuleDeletePopupComponent,
    ShippingPriceRuleDeleteDialogComponent,
    shippingPriceRuleRoute,
    shippingPriceRulePopupRoute
} from './';

const ENTITY_STATES = [...shippingPriceRuleRoute, ...shippingPriceRulePopupRoute];

@NgModule({
    imports: [MallSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ShippingPriceRuleComponent,
        ShippingPriceRuleDetailComponent,
        ShippingPriceRuleUpdateComponent,
        ShippingPriceRuleDeleteDialogComponent,
        ShippingPriceRuleDeletePopupComponent
    ],
    entryComponents: [
        ShippingPriceRuleComponent,
        ShippingPriceRuleUpdateComponent,
        ShippingPriceRuleDeleteDialogComponent,
        ShippingPriceRuleDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallShippingPriceRuleModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
