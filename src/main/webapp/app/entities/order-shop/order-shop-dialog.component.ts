import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { OrderShop } from './order-shop.model';
import { OrderShopPopupService } from './order-shop-popup.service';
import { OrderShopService } from './order-shop.service';
import { Shop, ShopService } from '../shop';
import { MyOrder, MyOrderService } from '../my-order';

@Component({
    selector: 'jhi-order-shop-dialog',
    templateUrl: './order-shop-dialog.component.html'
})
export class OrderShopDialogComponent implements OnInit {

    orderShop: OrderShop;
    isSaving: boolean;

    shops: Shop[];

    myorders: MyOrder[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private orderShopService: OrderShopService,
        private shopService: ShopService,
        private myOrderService: MyOrderService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.shopService
            .query({filter: 'ordershop-is-null'})
            .subscribe((res: HttpResponse<Shop[]>) => {
                if (!this.orderShop.shop || !this.orderShop.shop.id) {
                    this.shops = res.body;
                } else {
                    this.shopService
                        .find(this.orderShop.shop.id)
                        .subscribe((subRes: HttpResponse<Shop>) => {
                            this.shops = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
        this.myOrderService.query()
            .subscribe((res: HttpResponse<MyOrder[]>) => { this.myorders = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.orderShop.id !== undefined) {
            this.subscribeToSaveResponse(
                this.orderShopService.update(this.orderShop));
        } else {
            this.subscribeToSaveResponse(
                this.orderShopService.create(this.orderShop));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<OrderShop>>) {
        result.subscribe((res: HttpResponse<OrderShop>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: OrderShop) {
        this.eventManager.broadcast({ name: 'orderShopListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackShopById(index: number, item: Shop) {
        return item.id;
    }

    trackMyOrderById(index: number, item: MyOrder) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-order-shop-popup',
    template: ''
})
export class OrderShopPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private orderShopPopupService: OrderShopPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.orderShopPopupService
                    .open(OrderShopDialogComponent as Component, params['id']);
            } else {
                this.orderShopPopupService
                    .open(OrderShopDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
