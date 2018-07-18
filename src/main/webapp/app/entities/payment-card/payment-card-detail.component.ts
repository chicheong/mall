import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { PaymentCard } from './payment-card.model';
import { PaymentCardService } from './payment-card.service';

@Component({
    selector: 'jhi-payment-card-detail',
    templateUrl: './payment-card-detail.component.html'
})
export class PaymentCardDetailComponent implements OnInit, OnDestroy {

    paymentCard: PaymentCard;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private paymentCardService: PaymentCardService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInPaymentCards();
    }

    load(id) {
        this.paymentCardService.find(id)
            .subscribe((paymentCardResponse: HttpResponse<PaymentCard>) => {
                this.paymentCard = paymentCardResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInPaymentCards() {
        this.eventSubscriber = this.eventManager.subscribe(
            'paymentCardListModification',
            (response) => this.load(this.paymentCard.id)
        );
    }
}
