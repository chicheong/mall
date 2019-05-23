import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IProductStyleHistory } from 'app/shared/model/product-style-history.model';
import { AccountService } from 'app/core';
import { ProductStyleHistoryService } from './product-style-history.service';

@Component({
    selector: 'jhi-product-style-history',
    templateUrl: './product-style-history.component.html'
})
export class ProductStyleHistoryComponent implements OnInit, OnDestroy {
    productStyleHistories: IProductStyleHistory[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        protected productStyleHistoryService: ProductStyleHistoryService,
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
            this.productStyleHistoryService
                .search({
                    query: this.currentSearch
                })
                .pipe(
                    filter((res: HttpResponse<IProductStyleHistory[]>) => res.ok),
                    map((res: HttpResponse<IProductStyleHistory[]>) => res.body)
                )
                .subscribe(
                    (res: IProductStyleHistory[]) => (this.productStyleHistories = res),
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
        }
        this.productStyleHistoryService
            .query()
            .pipe(
                filter((res: HttpResponse<IProductStyleHistory[]>) => res.ok),
                map((res: HttpResponse<IProductStyleHistory[]>) => res.body)
            )
            .subscribe(
                (res: IProductStyleHistory[]) => {
                    this.productStyleHistories = res;
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
        this.registerChangeInProductStyleHistories();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IProductStyleHistory) {
        return item.id;
    }

    registerChangeInProductStyleHistories() {
        this.eventSubscriber = this.eventManager.subscribe('productStyleHistoryListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
