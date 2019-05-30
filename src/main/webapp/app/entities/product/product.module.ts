import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MallSharedModule } from 'app/shared';
import {
    ProductComponent,
    ProductDetailComponent,
    ProductUpdateComponent,
    ProductDeletePopupComponent,
    ProductDeleteDialogComponent,
    ProductItemsDialogComponent,
    ProductItemsUrlDialogComponent,
    PricesDialogComponent,
    QuantitiesDialogComponent,
    ProductDetailOtherDialogComponent,
    productRoute,
    productPopupRoute,
    GetItemFromColorSizePipe,
} from './';

const ENTITY_STATES = [...productRoute, ...productPopupRoute];

@NgModule({
    imports: [MallSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ProductComponent,
        ProductDetailComponent,
        ProductUpdateComponent,
        ProductDeleteDialogComponent,
        ProductDeletePopupComponent,
        ProductItemsDialogComponent,
        ProductItemsUrlDialogComponent,
        PricesDialogComponent,
        QuantitiesDialogComponent,
        GetItemFromColorSizePipe,
        ProductDetailOtherDialogComponent
    ],
    entryComponents: [ProductComponent, ProductUpdateComponent, ProductDeleteDialogComponent, ProductDeletePopupComponent,
        ProductItemsDialogComponent,
        ProductItemsUrlDialogComponent,
        PricesDialogComponent,
        QuantitiesDialogComponent,
        ProductDetailOtherDialogComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallProductModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
