import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MallSharedModule } from 'app/shared';
import {
    ProductItemComponent,
    ProductItemDetailComponent,
    ProductItemUpdateComponent,
    ProductItemDeletePopupComponent,
    ProductItemDeleteDialogComponent,
    productItemRoute,
    productItemPopupRoute
} from './';

const ENTITY_STATES = [...productItemRoute, ...productItemPopupRoute];

@NgModule({
    imports: [MallSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ProductItemComponent,
        ProductItemDetailComponent,
        ProductItemUpdateComponent,
        ProductItemDeleteDialogComponent,
        ProductItemDeletePopupComponent
    ],
    entryComponents: [ProductItemComponent, ProductItemUpdateComponent, ProductItemDeleteDialogComponent, ProductItemDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallProductItemModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
