import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { OrderStatusHistory } from './order-status-history.model';
import { OrderStatusHistoryPopupService } from './order-status-history-popup.service';
import { OrderStatusHistoryService } from './order-status-history.service';
import { Order, OrderService } from '../order';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-order-status-history-dialog',
    templateUrl: './order-status-history-dialog.component.html'
})
export class OrderStatusHistoryDialogComponent implements OnInit {

    orderStatusHistory: OrderStatusHistory;
    isSaving: boolean;

    orders: Order[];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private orderStatusHistoryService: OrderStatusHistoryService,
        private orderService: OrderService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.orderService.query()
            .subscribe((res: ResponseWrapper) => { this.orders = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.orderStatusHistory.id !== undefined) {
            this.subscribeToSaveResponse(
                this.orderStatusHistoryService.update(this.orderStatusHistory));
        } else {
            this.subscribeToSaveResponse(
                this.orderStatusHistoryService.create(this.orderStatusHistory));
        }
    }

    private subscribeToSaveResponse(result: Observable<OrderStatusHistory>) {
        result.subscribe((res: OrderStatusHistory) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: OrderStatusHistory) {
        this.eventManager.broadcast({ name: 'orderStatusHistoryListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    trackOrderById(index: number, item: Order) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-order-status-history-popup',
    template: ''
})
export class OrderStatusHistoryPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private orderStatusHistoryPopupService: OrderStatusHistoryPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.orderStatusHistoryPopupService
                    .open(OrderStatusHistoryDialogComponent as Component, params['id']);
            } else {
                this.orderStatusHistoryPopupService
                    .open(OrderStatusHistoryDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}