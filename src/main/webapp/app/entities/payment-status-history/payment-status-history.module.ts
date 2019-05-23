import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MallSharedModule } from 'app/shared';
import {
    PaymentStatusHistoryComponent,
    PaymentStatusHistoryDetailComponent,
    PaymentStatusHistoryUpdateComponent,
    PaymentStatusHistoryDeletePopupComponent,
    PaymentStatusHistoryDeleteDialogComponent,
    paymentStatusHistoryRoute,
    paymentStatusHistoryPopupRoute
} from './';

const ENTITY_STATES = [...paymentStatusHistoryRoute, ...paymentStatusHistoryPopupRoute];

@NgModule({
    imports: [MallSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        PaymentStatusHistoryComponent,
        PaymentStatusHistoryDetailComponent,
        PaymentStatusHistoryUpdateComponent,
        PaymentStatusHistoryDeleteDialogComponent,
        PaymentStatusHistoryDeletePopupComponent
    ],
    entryComponents: [
        PaymentStatusHistoryComponent,
        PaymentStatusHistoryUpdateComponent,
        PaymentStatusHistoryDeleteDialogComponent,
        PaymentStatusHistoryDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallPaymentStatusHistoryModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
