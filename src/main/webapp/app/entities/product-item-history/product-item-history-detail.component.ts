import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { ProductItemHistory } from './product-item-history.model';
import { ProductItemHistoryService } from './product-item-history.service';

@Component({
    selector: 'jhi-product-item-history-detail',
    templateUrl: './product-item-history-detail.component.html'
})
export class ProductItemHistoryDetailComponent implements OnInit, OnDestroy {

    productItemHistory: ProductItemHistory;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private productItemHistoryService: ProductItemHistoryService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInProductItemHistories();
    }

    load(id) {
        this.productItemHistoryService.find(id).subscribe((productItemHistory) => {
            this.productItemHistory = productItemHistory;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInProductItemHistories() {
        this.eventSubscriber = this.eventManager.subscribe(
            'productItemHistoryListModification',
            (response) => this.load(this.productItemHistory.id)
        );
    }
}
