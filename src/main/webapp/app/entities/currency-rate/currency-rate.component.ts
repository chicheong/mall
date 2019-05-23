import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ICurrencyRate } from 'app/shared/model/currency-rate.model';
import { AccountService } from 'app/core';
import { CurrencyRateService } from './currency-rate.service';

@Component({
    selector: 'jhi-currency-rate',
    templateUrl: './currency-rate.component.html'
})
export class CurrencyRateComponent implements OnInit, OnDestroy {
    currencyRates: ICurrencyRate[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        protected currencyRateService: CurrencyRateService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected activatedRoute: ActivatedRoute,
        protected accountService: AccountService
    ) {
        this.currentSearch =
            this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search']
                ? this.activatedRoute.snapshot.params['search']
                : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.currencyRateService
                .search({
                    query: this.currentSearch
                })
                .pipe(
                    filter((res: HttpResponse<ICurrencyRate[]>) => res.ok),
                    map((res: HttpResponse<ICurrencyRate[]>) => res.body)
                )
                .subscribe((res: ICurrencyRate[]) => (this.currencyRates = res), (res: HttpErrorResponse) => this.onError(res.message));
            return;
        }
        this.currencyRateService
            .query()
            .pipe(
                filter((res: HttpResponse<ICurrencyRate[]>) => res.ok),
                map((res: HttpResponse<ICurrencyRate[]>) => res.body)
            )
            .subscribe(
                (res: ICurrencyRate[]) => {
                    this.currencyRates = res;
                    this.currentSearch = '';
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    }

    clear() {
        this.currentSearch = '';
        this.loadAll();
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInCurrencyRates();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ICurrencyRate) {
        return item.id;
    }

    registerChangeInCurrencyRates() {
        this.eventSubscriber = this.eventManager.subscribe('currencyRateListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
