import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MallSharedModule } from 'app/shared';
import {
    ShippingTypeComponent,
    ShippingTypeDetailComponent,
    ShippingTypeUpdateComponent,
    ShippingTypeDeletePopupComponent,
    ShippingTypeDeleteDialogComponent,
    shippingTypeRoute,
    shippingTypePopupRoute
} from './';

const ENTITY_STATES = [...shippingTypeRoute, ...shippingTypePopupRoute];

@NgModule({
    imports: [MallSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ShippingTypeComponent,
        ShippingTypeDetailComponent,
        ShippingTypeUpdateComponent,
        ShippingTypeDeleteDialogComponent,
        ShippingTypeDeletePopupComponent
    ],
    entryComponents: [
        ShippingTypeComponent,
        ShippingTypeUpdateComponent,
        ShippingTypeDeleteDialogComponent,
        ShippingTypeDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallShippingTypeModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
