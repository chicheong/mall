import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { PaymentStatusHistory } from './payment-status-history.model';
import { PaymentStatusHistoryService } from './payment-status-history.service';

@Component({
    selector: 'jhi-payment-status-history-detail',
    templateUrl: './payment-status-history-detail.component.html'
})
export class PaymentStatusHistoryDetailComponent implements OnInit, OnDestroy {

    paymentStatusHistory: PaymentStatusHistory;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private paymentStatusHistoryService: PaymentStatusHistoryService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInPaymentStatusHistories();
    }

    load(id) {
        this.paymentStatusHistoryService.find(id)
            .subscribe((paymentStatusHistoryResponse: HttpResponse<PaymentStatusHistory>) => {
                this.paymentStatusHistory = paymentStatusHistoryResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInPaymentStatusHistories() {
        this.eventSubscriber = this.eventManager.subscribe(
            'paymentStatusHistoryListModification',
            (response) => this.load(this.paymentStatusHistory.id)
        );
    }
}
