import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MallSharedModule } from 'app/shared';
import {
    ProductStyleComponent,
    ProductStyleDetailComponent,
    ProductStyleUpdateComponent,
    ProductStyleDeletePopupComponent,
    ProductStyleDeleteDialogComponent,
    productStyleRoute,
    productStylePopupRoute
} from './';

const ENTITY_STATES = [...productStyleRoute, ...productStylePopupRoute];

@NgModule({
    imports: [MallSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ProductStyleComponent,
        ProductStyleDetailComponent,
        ProductStyleUpdateComponent,
        ProductStyleDeleteDialogComponent,
        ProductStyleDeletePopupComponent
    ],
    entryComponents: [
        ProductStyleComponent,
        ProductStyleUpdateComponent,
        ProductStyleDeleteDialogComponent,
        ProductStyleDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallProductStyleModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
