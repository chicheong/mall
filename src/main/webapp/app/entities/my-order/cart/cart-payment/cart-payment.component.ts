import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IMyOrder } from 'app/shared/model/my-order.model';
import { MyOrderService } from 'app/entities/my-order';
import { IPaymentCard, PaymentCard } from 'app/shared/model/payment-card.model';
import { IPayment, PaymentType } from 'app/shared/model/payment.model';
import { PaymentStatus } from 'app/shared/model/payment.model';

import { CartComponent } from 'app/entities/my-order/cart.component';

declare let paypal: any;

@Component({
    selector: 'jhi-payment',
    templateUrl: './cart-payment.component.html'
})
export class CartPaymentComponent extends CartComponent implements OnInit, OnDestroy {

    isSaving: boolean;
    selectedMethod: string;
    showContinue: boolean;

    /********** For Stripe card starts **********/
    paymentCard: IPaymentCard;
    stripeErrorCodePrefix = 'mallApp.myOrder.cart.payment.stripe.';
    // these are the known stripe error code@20180719
    stripeErrorCode = new Array('incorrect_number', 'invalid_number', 'invalid_expiry_month',
            'invalid_expiry_year', 'invalid_cvc', 'expired_card', 'incorrect_cvc', 'incorrect_zip',
            'card_declined', 'missing', 'processing_error', 'rate_limit');
    /********** For Stripe card ends **********/

    /********** For Paypal starts **********/
    payPaylButtonLoaded = false;
    paypalConfig = {
        env: 'sandbox',
        client: {
            sandbox: 'AYHgQIpqQCh3rjX5kTFawz6NB0GwNWlQqW4i8WTlMNHAOmQIRUdT4djZhBwq4Kt0nPjpTBhRvbTm-cqS',
            production: '<your-production-key here>'
        },
        style: {
            color: 'gold',   // 'gold, 'blue', 'silver', 'black'
            size:  'responsive', // 'medium', 'small', 'large', 'responsive'
            shape: 'pill'    // 'rect', 'pill'
        },
        commit: true,
        payment: (data, actions) => {
            return actions.payment.create({
                payment: {
                    transactions: [
                       {
                           amount: {
                               total: this.myOrder.total,
                               currency: this.myOrder.currency,
                               details: {
                                   subtotal: this.myOrderService.calculateTotalProductPrice(this.myOrder),
                                   tax: '0', // 0.07
                                   shipping: this.myOrderService.calculateTotalShippingPrice(this.myOrder),
                                   handling_fee: '0',
                                   shipping_discount: '0', // -1.00
                                   insurance: '0' // 0.01
                               }
                           },
                           description: 'The payment transaction description.',
                           custom: 'custom', // 90048630024435
                           // invoice_number: '12345', Insert a unique invoice number
                           payment_options: {
                               allowed_payment_method: 'INSTANT_FUNDING_SOURCE'
                           },
                           soft_descriptor: 'ECHI5786786',
                           item_list: {
                               items: this.myOrderService.getPaypalOrderItems(this.myOrder),
                               /**
                               items: [
                                   {
                                     name: 'hat',
                                     description: 'Brown hat.',
                                     quantity: '5',
                                     price: '3',
                                     tax: '0.01',
                                     sku: '1',
                                     currency: 'HKD'
                                   },
                                   {
                                     name: 'handbag',
                                     description: 'Black handbag.',
                                     quantity: '1',
                                     price: '15',
                                     tax: '0.02',
                                     sku: 'product34',
                                     currency: 'HKD'
                                   }
                              ],
                              */
                              shipping_address: {
                                   recipient_name: this.myOrder.receiver,
                                   line1: this.myOrder.shippingAddress.line1,
                                   line2: this.myOrder.shippingAddress.line2,
                                   city: 'HK',
                                   country_code: 'HK', // 'US'
                                   postal_code: this.myOrder.shippingAddress.postalCode,
                                   phone: this.myOrder.contactNum,
                                   state: '' // 'CA'
                              }
                           }
                       }
                    ],
                    note_to_payer: 'Contact us for any questions on your order.'
                }
            });
        },
        onAuthorize: (data, actions) => {
            return actions.payment.execute().then(payment => {
                // Do something when payment is successful.
                // window.alert('Thank you for your purchase! with payment: ' + payment);
                this.myOrder.payment.type = PaymentType.PAYPAL;
                // this.myOrder.payment.amount = this.myOrder.total;
                // this.myOrder.payment.currency = this.myOrder.currency;
                // this.myOrder.payment.status = PaymentStatus.PAID;
                this.subscribeToSaveResponse(
                        this.myOrderService.charge(this.myOrder), true);
            });
        }
    };
    /********** For Paypal ends **********/

    constructor(
        private jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected myOrderService: MyOrderService,
        protected route: ActivatedRoute,
        protected router: Router
    ) { super(eventManager, myOrderService, route, router); }

    ngOnInit() {
        super.ngOnInit();
        this.isSaving = false;
        this.showContinue = false;
        if (!this.myOrderService.paypalScriptTagElement) {
            this.addPaypalScript().then(() => {
                paypal.Button.render(this.paypalConfig, '#paypal-checkout-btn');
                this.payPaylButtonLoaded = true;
            });
        }
        if (!this.myOrderService.stripeScriptTagElement) {
            this.addStripeScript().then(() => {
                const stripePublishableKey = document.createElement('script');
                stripePublishableKey.innerHTML = 'Stripe.setPublishableKey("pk_test_YL2eKbUILQGVMcaai3EcSm1D");';
                document.body.appendChild(stripePublishableKey);
            });
        }
        this.paymentCard = Object.assign(new PaymentCard());
        this.paymentCard.holderName = 'Chan Chan Chan';
        this.paymentCard.cardNumber = '5555 5555 5555 4444';
    }

    /********** For Stripe card starts **********/
    chargeCard() {
        (<any>window).Stripe.card.createToken({
            number: this.paymentCard.cardNumber,
            exp_month: Number(this.paymentCard.expirationMonth),
            exp_year: Number(this.paymentCard.expirationYear),
            cvc: this.paymentCard.cvc
        }, (status: number, response: any) => {
            if (status === 200) {
                window.alert('token: ' + response.id);
                const token = response.id;
                // update Payment
                this.myOrder.payment.type = PaymentType.CREDIT_CARD;
                // this.myOrder.payment.amount = this.myOrder.total;
                // this.myOrder.payment.currency = this.myOrder.currency;
                // this.myOrder.payment.status = PaymentStatus.PENDING;
                this.myOrder.payment.token = token;
                this.myOrder.payment.paymentCard = this.paymentCard;
                this.subscribeToSaveResponse(
                        this.myOrderService.charge(this.myOrder), true);
            } else {
                const errorCode = response.error.code;
                let localizedCode: string;
                // Unknown Codes are treated as 'Internal server error'
                if (this.stripeErrorCode.indexOf(errorCode) >= 0) {
                    localizedCode = this.stripeErrorCodePrefix + errorCode;
                } else {
                    localizedCode = 'error.internalServerError';
                }
                this.jhiAlertService.error(localizedCode, null, null);
                // window.alert(response.error.message);
                this.isSaving = false;
            }
        });
    }
    addStripeScript() {
        return new Promise((resolve, reject) => {
            if (!this.myOrderService.stripeScriptTagElement) {
                this.myOrderService.stripeScriptTagElement = document.createElement('script');
                this.myOrderService.stripeScriptTagElement.src = 'https://js.stripe.com/v2/';
                this.myOrderService.stripeScriptTagElement.onload = resolve;
                document.body.appendChild(this.myOrderService.stripeScriptTagElement);
            }
        });
    }
    /********** For Stripe card ends **********/

    /********** For Paypal starts **********/
    addPaypalScript() {
        return new Promise((resolve, reject) => {
            if (!this.myOrderService.paypalScriptTagElement) {
                this.myOrderService.paypalScriptTagElement = document.createElement('script');
                this.myOrderService.paypalScriptTagElement.src = 'https://www.paypalobjects.com/api/checkout.js';
                this.myOrderService.paypalScriptTagElement.onload = resolve;
                document.body.appendChild(this.myOrderService.paypalScriptTagElement);
            }
        });
    }
    /********** For Paypal ends **********/

    onSelectionChange(entry) {
        if (entry === 'card') {
            this.showContinue = true;
        } else if (entry === 'paypal') {
            if (!this.payPaylButtonLoaded) {
                paypal.Button.render(this.paypalConfig, '#paypal-checkout-btn');
                this.payPaylButtonLoaded = true;
            }
            this.showContinue = false;
        } else if (entry === 'payme') {
            this.showContinue = true;
        }
    }

    expirationChange() {
    }

    save() {
        this.isSaving = true;
        if (this.selectedMethod) {
            if (this.selectedMethod === 'card') {
                if (this.paymentCard.expiration) {
                    if (this.paymentCard.expiration.indexOf('/') >= 0) {
                        const monthYearPair = this.paymentCard.expiration.split('/');
                        this.paymentCard.expirationMonth = monthYearPair[0];
                        this.paymentCard.expirationYear = monthYearPair[1];
                        // console.error('expirationMonth / expirationYear: ' + this.paymentCard.expirationMonth + '/' + this.paymentCard.expirationYear);
                    } else {
                        this.paymentCard.expirationMonth = '';
                        this.paymentCard.expirationYear = '';
                    }
                }
                this.chargeCard();
            } else if (this.selectedMethod === 'payme') {
                this.subscribeToSaveResponse(
                        this.myOrderService.update(this.myOrder), true);
            }
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IMyOrder>>, goNext: boolean) {
        result.subscribe((res: HttpResponse<IMyOrder>) =>
            this.onSaveSuccess(res.body, goNext), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: IMyOrder, goNext: boolean) {
        this.myOrder = result;
        this.eventManager.broadcast({ name: 'myOrderModification', content: 'OK', obj: result});
        this.isSaving = false;
        if (goNext) {
            this.myOrderService.doCartNextAction(this.myOrder, this.path);
        }
    }

    private onSaveError() {
        this.isSaving = false;
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    canGoNext() {
        if (this.myOrder && this.myOrder.shops && this.myOrder.shops.length > 0 && this.myOrder.payment) {
            return true;
        } else {
            return false;
        }
    }
}
