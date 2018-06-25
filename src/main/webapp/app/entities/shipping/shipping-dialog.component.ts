import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Shipping } from './shipping.model';
import { ShippingPopupService } from './shipping-popup.service';
import { ShippingService } from './shipping.service';
import { MyOrder, MyOrderService } from '../my-order';
import { Address, AddressService } from '../address';
import { ShippingType, ShippingTypeService } from '../shipping-type';

@Component({
    selector: 'jhi-shipping-dialog',
    templateUrl: './shipping-dialog.component.html'
})
export class ShippingDialogComponent implements OnInit {

    shipping: Shipping;
    isSaving: boolean;

    orders: MyOrder[];

    shippingAddresses: Address[];

    billingAddresses: Address[];

    shippingtypes: ShippingType[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private shippingService: ShippingService,
        private myOrderService: MyOrderService,
        private addressService: AddressService,
        private shippingTypeService: ShippingTypeService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.myOrderService
            .query({filter: 'shipping-is-null'})
            .subscribe((res: HttpResponse<MyOrder[]>) => {
                if (!this.shipping.order || !this.shipping.order.id) {
                    this.orders = res.body;
                } else {
                    this.myOrderService
                        .find(this.shipping.order.id)
                        .subscribe((subRes: HttpResponse<MyOrder>) => {
                            this.orders = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
        this.addressService
            .query({filter: 'shipping-is-null'})
            .subscribe((res: HttpResponse<Address[]>) => {
                if (!this.shipping.shippingAddress || !this.shipping.shippingAddress.id) {
                    this.shippingAddresses = res.body;
                } else {
                    this.addressService
                        .find(this.shipping.shippingAddress.id)
                        .subscribe((subRes: HttpResponse<Address>) => {
                            this.shippingAddresses = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
        this.addressService
            .query({filter: 'shipping-is-null'})
            .subscribe((res: HttpResponse<Address[]>) => {
                if (!this.shipping.billingAddress || !this.shipping.billingAddress.id) {
                    this.billingAddresses = res.body;
                } else {
                    this.addressService
                        .find(this.shipping.billingAddress.id)
                        .subscribe((subRes: HttpResponse<Address>) => {
                            this.billingAddresses = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
        this.shippingTypeService.query()
            .subscribe((res: HttpResponse<ShippingType[]>) => { this.shippingtypes = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.shipping.id !== undefined) {
            this.subscribeToSaveResponse(
                this.shippingService.update(this.shipping));
        } else {
            this.subscribeToSaveResponse(
                this.shippingService.create(this.shipping));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Shipping>>) {
        result.subscribe((res: HttpResponse<Shipping>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Shipping) {
        this.eventManager.broadcast({ name: 'shippingListModification', content: 'OK'});
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

    trackAddressById(index: number, item: Address) {
        return item.id;
    }

    trackShippingTypeById(index: number, item: ShippingType) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-shipping-popup',
    template: ''
})
export class ShippingPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private shippingPopupService: ShippingPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.shippingPopupService
                    .open(ShippingDialogComponent as Component, params['id']);
            } else {
                this.shippingPopupService
                    .open(ShippingDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
