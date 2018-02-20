import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { OrderStatusHistory } from './order-status-history.model';
import { OrderStatusHistoryService } from './order-status-history.service';

@Component({
    selector: 'jhi-order-status-history-detail',
    templateUrl: './order-status-history-detail.component.html'
})
export class OrderStatusHistoryDetailComponent implements OnInit, OnDestroy {

    orderStatusHistory: OrderStatusHistory;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private orderStatusHistoryService: OrderStatusHistoryService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInOrderStatusHistories();
    }

    load(id) {
        this.orderStatusHistoryService.find(id)
            .subscribe((orderStatusHistoryResponse: HttpResponse<OrderStatusHistory>) => {
                this.orderStatusHistory = orderStatusHistoryResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInOrderStatusHistories() {
        this.eventSubscriber = this.eventManager.subscribe(
            'orderStatusHistoryListModification',
            (response) => this.load(this.orderStatusHistory.id)
        );
    }
}
