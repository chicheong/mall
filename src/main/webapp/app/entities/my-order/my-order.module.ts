import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MallSharedModule } from 'app/shared';
import { NgXCreditCardsModule } from 'ngx-credit-cards';
import {
    MyOrderComponent,
    MyOrderDetailComponent,
    MyOrderUpdateComponent,
    MyOrderDeletePopupComponent,
    MyOrderDeleteDialogComponent,
    myOrderRoute,
    myOrderPopupRoute
} from './';

import { CartComponent } from './cart.component';
import { CartControlComponent } from './cart/cart-control/cart-control.component';
import { CartSummaryComponent } from './cart/cart-summary/cart-summary.component';
import { CartBillingComponent } from './cart/cart-billing/cart-billing.component';
import { CartPaymentComponent } from './cart/cart-payment/cart-payment.component';
import { CartPendingComponent } from './cart/cart-pending/cart-pending.component';
import { CartReviewComponent } from './cart/cart-review/cart-review.component';
import { CartMethodComponent } from './cart/cart-method/cart-method.component';
import { CartShippingComponent } from './cart/cart-shipping/cart-shipping.component';
import { CartConfirmationComponent } from './cart/cart-confirmation/cart-confirmation.component';

const ENTITY_STATES = [...myOrderRoute, ...myOrderPopupRoute];

@NgModule({
    imports: [MallSharedModule, RouterModule.forChild(ENTITY_STATES), NgXCreditCardsModule],
    declarations: [
        MyOrderComponent,
        MyOrderDetailComponent,
        MyOrderUpdateComponent,
        MyOrderDeleteDialogComponent,
        MyOrderDeletePopupComponent,
        CartComponent,
        CartControlComponent,
        CartSummaryComponent,
        CartBillingComponent,
        CartPaymentComponent,
        CartPendingComponent,
        CartReviewComponent,
        CartMethodComponent,
        CartShippingComponent,
        CartConfirmationComponent
    ],
    entryComponents: [MyOrderComponent, MyOrderUpdateComponent, MyOrderDeleteDialogComponent, MyOrderDeletePopupComponent,
        CartComponent,
        CartControlComponent,
        CartSummaryComponent,
        CartBillingComponent,
        CartPaymentComponent,
        CartPendingComponent,
        CartReviewComponent,
        CartMethodComponent,
        CartShippingComponent,
        CartConfirmationComponent
    ],
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
