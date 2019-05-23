import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IProductStyle } from 'app/shared/model/product-style.model';
import { AccountService } from 'app/core';
import { ProductStyleService } from './product-style.service';

@Component({
    selector: 'jhi-product-style',
    templateUrl: './product-style.component.html'
})
export class ProductStyleComponent implements OnInit, OnDestroy {
    productStyles: IProductStyle[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        protected productStyleService: ProductStyleService,
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
            this.productStyleService
                .search({
                    query: this.currentSearch
                })
                .pipe(
                    filter((res: HttpResponse<IProductStyle[]>) => res.ok),
                    map((res: HttpResponse<IProductStyle[]>) => res.body)
                )
                .subscribe((res: IProductStyle[]) => (this.productStyles = res), (res: HttpErrorResponse) => this.onError(res.message));
            return;
        }
        this.productStyleService
            .query()
            .pipe(
                filter((res: HttpResponse<IProductStyle[]>) => res.ok),
                map((res: HttpResponse<IProductStyle[]>) => res.body)
            )
            .subscribe(
                (res: IProductStyle[]) => {
                    this.productStyles = res;
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
        this.registerChangeInProductStyles();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IProductStyle) {
        return item.id;
    }

    registerChangeInProductStyles() {
        this.eventSubscriber = this.eventManager.subscribe('productStyleListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
