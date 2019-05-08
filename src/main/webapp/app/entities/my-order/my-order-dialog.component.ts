import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { MyOrder } from './my-order.model';
import { MyOrderPopupService } from './my-order-popup.service';
import { MyOrderService } from './my-order.service';
import { Address, AddressService } from '../address';
import { MyAccount, MyAccountService } from '../my-account';

@Component({
    selector: 'jhi-my-order-dialog',
    templateUrl: './my-order-dialog.component.html'
})
export class MyOrderDialogComponent implements OnInit {

    myOrder: MyOrder;
    isSaving: boolean;

    shippingAddresses: Address[];

    billingAddresses: Address[];

    myaccounts: MyAccount[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private myOrderService: MyOrderService,
        private addressService: AddressService,
        private myAccountService: MyAccountService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.addressService
            .query({filter: 'shipping-is-null'})
            .subscribe((res: HttpResponse<Address[]>) => {
                if (!this.myOrder.shippingAddress || !this.myOrder.shippingAddress.id) {
                    this.shippingAddresses = res.body;
                } else {
                    this.addressService
                        .find(this.myOrder.shippingAddress.id)
                        .subscribe((subRes: HttpResponse<Address>) => {
                            this.shippingAddresses = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
        this.addressService
            .query({filter: 'shipping-is-null'})
            .subscribe((res: HttpResponse<Address[]>) => {
                if (!this.myOrder.billingAddress || !this.myOrder.billingAddress.id) {
                    this.billingAddresses = res.body;
                } else {
                    this.addressService
                        .find(this.myOrder.billingAddress.id)
                        .subscribe((subRes: HttpResponse<Address>) => {
                            this.billingAddresses = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
        this.myAccountService.query()
            .subscribe((res: HttpResponse<MyAccount[]>) => { this.myaccounts = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
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

    private subscribeToSaveResponse(result: Observable<HttpResponse<MyOrder>>) {
        result.subscribe((res: HttpResponse<MyOrder>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
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

    trackAddressById(index: number, item: Address) {
        return item.id;
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
