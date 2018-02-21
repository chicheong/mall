import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { ProductStyleHistory } from './product-style-history.model';
import { ProductStyleHistoryService } from './product-style-history.service';

@Component({
    selector: 'jhi-product-style-history-detail',
    templateUrl: './product-style-history-detail.component.html'
})
export class ProductStyleHistoryDetailComponent implements OnInit, OnDestroy {

    productStyleHistory: ProductStyleHistory;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private productStyleHistoryService: ProductStyleHistoryService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInProductStyleHistories();
    }

    load(id) {
        this.productStyleHistoryService.find(id)
            .subscribe((productStyleHistoryResponse: HttpResponse<ProductStyleHistory>) => {
                this.productStyleHistory = productStyleHistoryResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInProductStyleHistories() {
        this.eventSubscriber = this.eventManager.subscribe(
            'productStyleHistoryListModification',
            (response) => this.load(this.productStyleHistory.id)
        );
    }
}
