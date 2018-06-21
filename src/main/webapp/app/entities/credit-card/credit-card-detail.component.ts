import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { CreditCard } from './credit-card.model';
import { CreditCardService } from './credit-card.service';

@Component({
    selector: 'jhi-credit-card-detail',
    templateUrl: './credit-card-detail.component.html'
})
export class CreditCardDetailComponent implements OnInit, OnDestroy {

    creditCard: CreditCard;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private creditCardService: CreditCardService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInCreditCards();
    }

    load(id) {
        this.creditCardService.find(id)
            .subscribe((creditCardResponse: HttpResponse<CreditCard>) => {
                this.creditCard = creditCardResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInCreditCards() {
        this.eventSubscriber = this.eventManager.subscribe(
            'creditCardListModification',
            (response) => this.load(this.creditCard.id)
        );
    }
}
