import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MallSharedModule } from 'app/shared';
import {
    OrderShopComponent,
    OrderShopDetailComponent,
    OrderShopUpdateComponent,
    OrderShopDeletePopupComponent,
    OrderShopDeleteDialogComponent,
    orderShopRoute,
    orderShopPopupRoute
} from './';

const ENTITY_STATES = [...orderShopRoute, ...orderShopPopupRoute];

@NgModule({
    imports: [MallSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        OrderShopComponent,
        OrderShopDetailComponent,
        OrderShopUpdateComponent,
        OrderShopDeleteDialogComponent,
        OrderShopDeletePopupComponent
    ],
    entryComponents: [OrderShopComponent, OrderShopUpdateComponent, OrderShopDeleteDialogComponent, OrderShopDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallOrderShopModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
