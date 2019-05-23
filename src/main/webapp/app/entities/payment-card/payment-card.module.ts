import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MallSharedModule } from 'app/shared';
import {
    PaymentCardComponent,
    PaymentCardDetailComponent,
    PaymentCardUpdateComponent,
    PaymentCardDeletePopupComponent,
    PaymentCardDeleteDialogComponent,
    paymentCardRoute,
    paymentCardPopupRoute
} from './';

const ENTITY_STATES = [...paymentCardRoute, ...paymentCardPopupRoute];

@NgModule({
    imports: [MallSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        PaymentCardComponent,
        PaymentCardDetailComponent,
        PaymentCardUpdateComponent,
        PaymentCardDeleteDialogComponent,
        PaymentCardDeletePopupComponent
    ],
    entryComponents: [PaymentCardComponent, PaymentCardUpdateComponent, PaymentCardDeleteDialogComponent, PaymentCardDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallPaymentCardModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
