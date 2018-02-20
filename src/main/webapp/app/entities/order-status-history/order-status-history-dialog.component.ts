import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { OrderStatusHistory } from './order-status-history.model';
import { OrderStatusHistoryPopupService } from './order-status-history-popup.service';
import { OrderStatusHistoryService } from './order-status-history.service';
import { MyOrder, MyOrderService } from '../my-order';

@Component({
    selector: 'jhi-order-status-history-dialog',
    templateUrl: './order-status-history-dialog.component.html'
})
export class OrderStatusHistoryDialogComponent implements OnInit {

    orderStatusHistory: OrderStatusHistory;
    isSaving: boolean;

    myorders: MyOrder[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private orderStatusHistoryService: OrderStatusHistoryService,
        private myOrderService: MyOrderService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.myOrderService.query()
            .subscribe((res: HttpResponse<MyOrder[]>) => { this.myorders = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
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

    private subscribeToSaveResponse(result: Observable<HttpResponse<OrderStatusHistory>>) {
        result.subscribe((res: HttpResponse<OrderStatusHistory>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: OrderStatusHistory) {
        this.eventManager.broadcast({ name: 'orderStatusHistoryListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackMyOrderById(index: number, item: MyOrder) {
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
