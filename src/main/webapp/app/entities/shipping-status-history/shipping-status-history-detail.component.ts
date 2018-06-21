import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { ShippingStatusHistory } from './shipping-status-history.model';
import { ShippingStatusHistoryService } from './shipping-status-history.service';

@Component({
    selector: 'jhi-shipping-status-history-detail',
    templateUrl: './shipping-status-history-detail.component.html'
})
export class ShippingStatusHistoryDetailComponent implements OnInit, OnDestroy {

    shippingStatusHistory: ShippingStatusHistory;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private shippingStatusHistoryService: ShippingStatusHistoryService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInShippingStatusHistories();
    }

    load(id) {
        this.shippingStatusHistoryService.find(id)
            .subscribe((shippingStatusHistoryResponse: HttpResponse<ShippingStatusHistory>) => {
                this.shippingStatusHistory = shippingStatusHistoryResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInShippingStatusHistories() {
        this.eventSubscriber = this.eventManager.subscribe(
            'shippingStatusHistoryListModification',
            (response) => this.load(this.shippingStatusHistory.id)
        );
    }
}
