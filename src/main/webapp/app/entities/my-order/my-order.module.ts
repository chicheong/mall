import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MallSharedModule } from '../../shared';
import {
    MyOrderService,
    MyOrderPopupService,
    MyOrderComponent,
    MyOrderDetailComponent,
    MyOrderDialogComponent,
    MyOrderPopupComponent,
    MyOrderDeletePopupComponent,
    MyOrderDeleteDialogComponent,
    CheckoutComponent,
    myOrderRoute,
    myOrderPopupRoute,
    MyOrderResolvePagingParams,
} from './';

import { CheckoutControlComponent } from './cart/checkout-control/checkout-control.component';
import { CheckoutSummaryComponent } from './cart/checkout-summary/checkout-summary.component';
import { BillingInfoComponent } from './cart/billing-info/billing-info.component';
import { PaymentComponent } from './cart/payment/payment.component';
import { ReviewCartComponent } from './cart/review-cart/review-cart.component';
import { ShippingComponent } from './cart/shipping/shipping.component';
import { ShippingInfoComponent } from './cart/shipping-info/shipping-info.component';

const ENTITY_STATES = [
    ...myOrderRoute,
    ...myOrderPopupRoute,
];

@NgModule({
    imports: [
        MallSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        MyOrderComponent,
        MyOrderDetailComponent,
        MyOrderDialogComponent,
        MyOrderDeleteDialogComponent,
        MyOrderPopupComponent,
        MyOrderDeletePopupComponent,
        CheckoutComponent,
        CheckoutControlComponent,
        CheckoutSummaryComponent,
        BillingInfoComponent,
        PaymentComponent,
        ReviewCartComponent,
        ShippingComponent,
        ShippingInfoComponent,
    ],
    entryComponents: [
        MyOrderComponent,
        MyOrderDialogComponent,
        MyOrderPopupComponent,
        MyOrderDeleteDialogComponent,
        MyOrderDeletePopupComponent,
        CheckoutComponent,
        CheckoutControlComponent,
        CheckoutSummaryComponent,
        BillingInfoComponent,
        PaymentComponent,
        ReviewCartComponent,
        ShippingComponent,
        ShippingInfoComponent,
    ],
    providers: [
        MyOrderService,
        MyOrderPopupService,
        MyOrderResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MallMyOrderModule {}
