import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ShippingStatusHistory } from './shipping-status-history.model';
import { ShippingStatusHistoryPopupService } from './shipping-status-history-popup.service';
import { ShippingStatusHistoryService } from './shipping-status-history.service';
import { Shipping, ShippingService } from '../shipping';

@Component({
    selector: 'jhi-shipping-status-history-dialog',
    templateUrl: './shipping-status-history-dialog.component.html'
})
export class ShippingStatusHistoryDialogComponent implements OnInit {

    shippingStatusHistory: ShippingStatusHistory;
    isSaving: boolean;

    shippings: Shipping[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private shippingStatusHistoryService: ShippingStatusHistoryService,
        private shippingService: ShippingService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.shippingService.query()
            .subscribe((res: HttpResponse<Shipping[]>) => { this.shippings = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.shippingStatusHistory.id !== undefined) {
            this.subscribeToSaveResponse(
                this.shippingStatusHistoryService.update(this.shippingStatusHistory));
        } else {
            this.subscribeToSaveResponse(
                this.shippingStatusHistoryService.create(this.shippingStatusHistory));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ShippingStatusHistory>>) {
        result.subscribe((res: HttpResponse<ShippingStatusHistory>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: ShippingStatusHistory) {
        this.eventManager.broadcast({ name: 'shippingStatusHistoryListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackShippingById(index: number, item: Shipping) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-shipping-status-history-popup',
    template: ''
})
export class ShippingStatusHistoryPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private shippingStatusHistoryPopupService: ShippingStatusHistoryPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.shippingStatusHistoryPopupService
                    .open(ShippingStatusHistoryDialogComponent as Component, params['id']);
            } else {
                this.shippingStatusHistoryPopupService
                    .open(ShippingStatusHistoryDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
