import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from '../../shared';
import { NgXCreditCardsModule } from 'ngx-credit-cards';
import {
    MyOrderService,
    MyOrderPopupService,
    MyOrderComponent,
    MyOrderDetailComponent,
    MyOrderDialogComponent,
    MyOrderPopupComponent,
    MyOrderDeletePopupComponent,
    MyOrderDeleteDialogComponent,
    myOrderRoute,
    myOrderPopupRoute,
    MyOrderResolvePagingParams,
} from './';

import { CartComponent } from './cart.component';
import { CartControlComponent } from './cart/cart-control/cart-control.component';
import { CartSummaryComponent } from './cart/cart-summary/cart-summary.component';
import { CartBillingComponent } from './cart/cart-billing/cart-billing.component';
import { CartPaymentComponent } from './cart/cart-payment/cart-payment.component';
import { CartReviewComponent } from './cart/cart-review/cart-review.component';
import { CartMethodComponent } from './cart/cart-method/cart-method.component';
import { CartShippingComponent } from './cart/cart-shipping/cart-shipping.component';

const ENTITY_STATES = [
    ...myOrderRoute,
    ...myOrderPopupRoute,
];

@NgModule({
    imports: [
        MallSharedModule,
        RouterModule.forChild(ENTITY_STATES),
        NgXCreditCardsModule
    ],
    declarations: [
        MyOrderComponent,
        MyOrderDetailComponent,
        MyOrderDialogComponent,
        MyOrderDeleteDialogComponent,
        MyOrderPopupComponent,
        MyOrderDeletePopupComponent,
        CartComponent,
        CartControlComponent,
        CartSummaryComponent,
        CartBillingComponent,
        CartPaymentComponent,
        CartReviewComponent,
        CartMethodComponent,
        CartShippingComponent,
    ],
    entryComponents: [
        MyOrderComponent,
        MyOrderDialogComponent,
        MyOrderPopupComponent,
        MyOrderDeleteDialogComponent,
        MyOrderDeletePopupComponent,
        CartComponent,
        CartControlComponent,
        CartSummaryComponent,
        CartBillingComponent,
        CartPaymentComponent,
        CartReviewComponent,
        CartMethodComponent,
        CartShippingComponent,
    ],
    providers: [
        MyOrderService,
        MyOrderPopupService,
        MyOrderResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallMyOrderModule {}
