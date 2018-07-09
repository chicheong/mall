import { Component, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
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
export class CartPaymentComponent extends CartComponent implements OnInit, OnDestroy, AfterViewChecked {

    isSaving: boolean;
    selectedMethod: string;

/********** For Paypal starts **********/
    addScript = false;
    paypalLoad = true;
    paypalConfig = {
        env: 'sandbox',
        client: {
            sandbox: '<your-sandbox-key-here>',
            production: '<your-production-key here>'
        },
        style: {
            color: 'gold',   // 'gold, 'blue', 'silver', 'black'
            size:  'responsive', // 'medium', 'small', 'large', 'responsive'
            shape: 'rect'    // 'rect', 'pill'
        },
        commit: true,
        payment: (data, actions) => {
            return actions.payment.create({
                payment: {
                    transactions: [
                                   { amount: { total: this.myOrder.total, currency: 'INR' } }
                    ]
                }
            });
        },
        onAuthorize: (data, actions) => {
            return actions.payment.execute().then((payment) => {
                // Do something when payment is successful.
            });
        }
    };
    ngAfterViewChecked(): void {
        if (!this.addScript) {
            this.addPaypalScript().then(() => {
                paypal.Button.render(this.paypalConfig, '#paypal-checkout-btn');
                this.paypalLoad = false;
            });
        }
    }
    addPaypalScript() {
        this.addScript = true;
        return new Promise((resolve, reject) => {
            const scripttagElement = document.createElement('script');
            scripttagElement.src = 'https://www.paypalobjects.com/api/checkout.js';
            scripttagElement.onload = resolve;
            document.body.appendChild(scripttagElement);
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
    }

    onSelectionChange(entry) {
        if (entry === 'credit') {

        } else if (entry === 'paypal') {

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
