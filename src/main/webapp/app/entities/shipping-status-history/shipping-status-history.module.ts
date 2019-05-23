import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MallSharedModule } from 'app/shared';
import {
    ShippingStatusHistoryComponent,
    ShippingStatusHistoryDetailComponent,
    ShippingStatusHistoryUpdateComponent,
    ShippingStatusHistoryDeletePopupComponent,
    ShippingStatusHistoryDeleteDialogComponent,
    shippingStatusHistoryRoute,
    shippingStatusHistoryPopupRoute
} from './';

const ENTITY_STATES = [...shippingStatusHistoryRoute, ...shippingStatusHistoryPopupRoute];

@NgModule({
    imports: [MallSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ShippingStatusHistoryComponent,
        ShippingStatusHistoryDetailComponent,
        ShippingStatusHistoryUpdateComponent,
        ShippingStatusHistoryDeleteDialogComponent,
        ShippingStatusHistoryDeletePopupComponent
    ],
    entryComponents: [
        ShippingStatusHistoryComponent,
        ShippingStatusHistoryUpdateComponent,
        ShippingStatusHistoryDeleteDialogComponent,
        ShippingStatusHistoryDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallShippingStatusHistoryModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
