import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MallSharedModule } from 'app/shared';
import {
    OrderStatusHistoryComponent,
    OrderStatusHistoryDetailComponent,
    OrderStatusHistoryUpdateComponent,
    OrderStatusHistoryDeletePopupComponent,
    OrderStatusHistoryDeleteDialogComponent,
    orderStatusHistoryRoute,
    orderStatusHistoryPopupRoute
} from './';

const ENTITY_STATES = [...orderStatusHistoryRoute, ...orderStatusHistoryPopupRoute];

@NgModule({
    imports: [MallSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        OrderStatusHistoryComponent,
        OrderStatusHistoryDetailComponent,
        OrderStatusHistoryUpdateComponent,
        OrderStatusHistoryDeleteDialogComponent,
        OrderStatusHistoryDeletePopupComponent
    ],
    entryComponents: [
        OrderStatusHistoryComponent,
        OrderStatusHistoryUpdateComponent,
        OrderStatusHistoryDeleteDialogComponent,
        OrderStatusHistoryDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallOrderStatusHistoryModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
