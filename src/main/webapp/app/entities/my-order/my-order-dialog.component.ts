import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { MyOrder } from './my-order.model';
import { MyOrderPopupService } from './my-order-popup.service';
import { MyOrderService } from './my-order.service';
import { MyAccount, MyAccountService } from '../my-account';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-my-order-dialog',
    templateUrl: './my-order-dialog.component.html'
})
export class MyOrderDialogComponent implements OnInit {

    myOrder: MyOrder;
    isSaving: boolean;

    myaccounts: MyAccount[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private myOrderService: MyOrderService,
        private myAccountService: MyAccountService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.myAccountService.query()
            .subscribe((res: ResponseWrapper) => { this.myaccounts = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.myOrder.id !== undefined) {
            this.subscribeToSaveResponse(
                this.myOrderService.update(this.myOrder));
        } else {
            this.subscribeToSaveResponse(
                this.myOrderService.create(this.myOrder));
        }
    }

    private subscribeToSaveResponse(result: Observable<MyOrder>) {
        result.subscribe((res: MyOrder) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: MyOrder) {
        this.eventManager.broadcast({ name: 'myOrderListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackMyAccountById(index: number, item: MyAccount) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-my-order-popup',
    template: ''
})
export class MyOrderPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private myOrderPopupService: MyOrderPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.myOrderPopupService
                    .open(MyOrderDialogComponent as Component, params['id']);
            } else {
                this.myOrderPopupService
                    .open(MyOrderDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
