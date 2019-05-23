import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MallSharedModule } from 'app/shared';
import {
    MyOrderComponent,
    MyOrderDetailComponent,
    MyOrderUpdateComponent,
    MyOrderDeletePopupComponent,
    MyOrderDeleteDialogComponent,
    myOrderRoute,
    myOrderPopupRoute
} from './';

const ENTITY_STATES = [...myOrderRoute, ...myOrderPopupRoute];

@NgModule({
    imports: [MallSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        MyOrderComponent,
        MyOrderDetailComponent,
        MyOrderUpdateComponent,
        MyOrderDeleteDialogComponent,
        MyOrderDeletePopupComponent
    ],
    entryComponents: [MyOrderComponent, MyOrderUpdateComponent, MyOrderDeleteDialogComponent, MyOrderDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallMyOrderModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
