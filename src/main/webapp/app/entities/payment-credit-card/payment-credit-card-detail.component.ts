import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { PaymentCreditCard } from './payment-credit-card.model';
import { PaymentCreditCardService } from './payment-credit-card.service';

@Component({
    selector: 'jhi-payment-credit-card-detail',
    templateUrl: './payment-credit-card-detail.component.html'
})
export class PaymentCreditCardDetailComponent implements OnInit, OnDestroy {

    paymentCreditCard: PaymentCreditCard;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private paymentCreditCardService: PaymentCreditCardService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInPaymentCreditCards();
    }

    load(id) {
        this.paymentCreditCardService.find(id)
            .subscribe((paymentCreditCardResponse: HttpResponse<PaymentCreditCard>) => {
                this.paymentCreditCard = paymentCreditCardResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInPaymentCreditCards() {
        this.eventSubscriber = this.eventManager.subscribe(
            'paymentCreditCardListModification',
            (response) => this.load(this.paymentCreditCard.id)
        );
    }
}
