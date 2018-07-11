import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { MyOrder } from './../../my-order.model';
import { MyOrderService } from './../../my-order.service';

import { CartComponent } from './../../cart.component';

declare let paypal: any;

@Component({
    selector: 'jhi-payment',
    templateUrl: './cart-payment.component.html'
})
export class CartPaymentComponent extends CartComponent implements OnInit, OnDestroy {

    isSaving: boolean;
    selectedMethod: string;

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
                                   subtotal: this.myOrderService.sumAll(this.myOrder),
                                   tax: '0', // 0.07
                                   shipping: this.myOrder.shipping.price,
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
                                   recipient_name: this.myOrder.shipping.receiver,
                                   line1: this.myOrder.shipping.shippingAddress.line1,
                                   line2: this.myOrder.shipping.shippingAddress.line2,
                                   city: 'HK',
                                   country_code: 'HK', // 'US'
                                   postal_code: this.myOrder.shipping.shippingAddress.postalCode,
                                   phone: this.myOrder.shipping.contactNum,
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
            return actions.payment.execute().then((payment) => {
                // Do something when payment is successful.
                window.alert('Thank you for your purchase! with payment: ' + payment);
            });
        }
    };
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

    constructor(
        protected eventManager: JhiEventManager,
        protected myOrderService: MyOrderService,
        protected route: ActivatedRoute,
        protected router: Router
    ) { super(eventManager, myOrderService, route, router); }

    ngOnInit() {
        super.ngOnInit();
        this.isSaving = false;
        if (!this.myOrderService.paypalScriptTagElement) {
            this.addPaypalScript().then(() => {
                paypal.Button.render(this.paypalConfig, '#paypal-checkout-btn');
                this.payPaylButtonLoaded = true;
            });
        }
    }

    onSelectionChange(entry) {
        if (entry === 'credit') {
        } else if (entry === 'paypal') {
            if (!this.payPaylButtonLoaded) {
                paypal.Button.render(this.paypalConfig, '#paypal-checkout-btn');
                this.payPaylButtonLoaded = true;
            }
        } else if (entry === 'payme') {
        }
    }

    save() {
        this.isSaving = true;
        this.subscribeToSaveResponse(
                this.myOrderService.update(this.myOrder));
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<MyOrder>>) {
        result.subscribe((res: HttpResponse<MyOrder>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: MyOrder) {
        this.myOrder = result;
        this.eventManager.broadcast({ name: 'myOrderModification', content: 'OK', obj: result});
        this.isSaving = false;
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
        if (this.myOrder && this.myOrder.items && this.myOrder.items.length > 0 && this.myOrder.shipping && this.myOrder.payment && this.myOrder.payment.amount > 0) {
            return true;
        } else {
            return false;
        }
    }
}
