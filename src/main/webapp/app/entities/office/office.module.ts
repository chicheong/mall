import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MallSharedModule } from 'app/shared';
import {
    OfficeComponent,
    OfficeDetailComponent,
    OfficeUpdateComponent,
    OfficeDeletePopupComponent,
    OfficeDeleteDialogComponent,
    officeRoute,
    officePopupRoute
} from './';

const ENTITY_STATES = [...officeRoute, ...officePopupRoute];

@NgModule({
    imports: [MallSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [OfficeComponent, OfficeDetailComponent, OfficeUpdateComponent, OfficeDeleteDialogComponent, OfficeDeletePopupComponent],
    entryComponents: [OfficeComponent, OfficeUpdateComponent, OfficeDeleteDialogComponent, OfficeDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallOfficeModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
