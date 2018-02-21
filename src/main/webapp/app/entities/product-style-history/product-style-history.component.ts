import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ProductStyleHistory } from './product-style-history.model';
import { ProductStyleHistoryService } from './product-style-history.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-product-style-history',
    templateUrl: './product-style-history.component.html'
})
export class ProductStyleHistoryComponent implements OnInit, OnDestroy {
productStyleHistories: ProductStyleHistory[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private productStyleHistoryService: ProductStyleHistoryService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch = this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ?
            this.activatedRoute.snapshot.params['search'] : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.productStyleHistoryService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<ProductStyleHistory[]>) => this.productStyleHistories = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.productStyleHistoryService.query().subscribe(
            (res: HttpResponse<ProductStyleHistory[]>) => {
                this.productStyleHistories = res.body;
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
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInProductStyleHistories();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ProductStyleHistory) {
        return item.id;
    }
    registerChangeInProductStyleHistories() {
        this.eventSubscriber = this.eventManager.subscribe('productStyleHistoryListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
