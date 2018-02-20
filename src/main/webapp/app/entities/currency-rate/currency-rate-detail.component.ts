import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { CurrencyRate } from './currency-rate.model';
import { CurrencyRateService } from './currency-rate.service';

@Component({
    selector: 'jhi-currency-rate-detail',
    templateUrl: './currency-rate-detail.component.html'
})
export class CurrencyRateDetailComponent implements OnInit, OnDestroy {

    currencyRate: CurrencyRate;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private currencyRateService: CurrencyRateService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInCurrencyRates();
    }

    load(id) {
        this.currencyRateService.find(id)
            .subscribe((currencyRateResponse: HttpResponse<CurrencyRate>) => {
                this.currencyRate = currencyRateResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInCurrencyRates() {
        this.eventSubscriber = this.eventManager.subscribe(
            'currencyRateListModification',
            (response) => this.load(this.currencyRate.id)
        );
    }
}
