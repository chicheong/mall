import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager  } from 'ng-jhipster';

import { ProductHistory } from './product-history.model';
import { ProductHistoryService } from './product-history.service';

@Component({
    selector: 'jhi-product-history-detail',
    templateUrl: './product-history-detail.component.html'
})
export class ProductHistoryDetailComponent implements OnInit, OnDestroy {

    productHistory: ProductHistory;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private productHistoryService: ProductHistoryService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInProductHistories();
    }

    load(id) {
        this.productHistoryService.find(id).subscribe((productHistory) => {
            this.productHistory = productHistory;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInProductHistories() {
        this.eventSubscriber = this.eventManager.subscribe(
            'productHistoryListModification',
            (response) => this.load(this.productHistory.id)
        );
    }
}
