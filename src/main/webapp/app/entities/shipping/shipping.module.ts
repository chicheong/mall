import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MallSharedModule } from 'app/shared';
import {
    ShippingComponent,
    ShippingDetailComponent,
    ShippingUpdateComponent,
    ShippingDeletePopupComponent,
    ShippingDeleteDialogComponent,
    shippingRoute,
    shippingPopupRoute
} from './';

const ENTITY_STATES = [...shippingRoute, ...shippingPopupRoute];

@NgModule({
    imports: [MallSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ShippingComponent,
        ShippingDetailComponent,
        ShippingUpdateComponent,
        ShippingDeleteDialogComponent,
        ShippingDeletePopupComponent
    ],
    entryComponents: [ShippingComponent, ShippingUpdateComponent, ShippingDeleteDialogComponent, ShippingDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallShippingModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
