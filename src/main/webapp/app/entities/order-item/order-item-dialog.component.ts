import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { OrderItem } from './order-item.model';
import { OrderItemPopupService } from './order-item-popup.service';
import { OrderItemService } from './order-item.service';
import { ProductItem, ProductItemService } from '../product-item';
import { OrderShop, OrderShopService } from '../order-shop';

@Component({
    selector: 'jhi-order-item-dialog',
    templateUrl: './order-item-dialog.component.html'
})
export class OrderItemDialogComponent implements OnInit {

    orderItem: OrderItem;
    isSaving: boolean;

    productitems: ProductItem[];

    ordershops: OrderShop[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private orderItemService: OrderItemService,
        private productItemService: ProductItemService,
        private orderShopService: OrderShopService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.productItemService.query()
            .subscribe((res: HttpResponse<ProductItem[]>) => { this.productitems = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        /**this.productItemService
            .query({filter: 'orderitem-is-null'})
            .subscribe((res: HttpResponse<ProductItem[]>) => {
                if (!this.orderItem.productItem || !this.orderItem.productItem.id) {
                    this.productitems = res.body;
                } else {
                    this.productItemService
                        .find(this.orderItem.productItem.id)
                        .subscribe((subRes: HttpResponse<ProductItem>) => {
                            this.productitems = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message)); */
        this.orderShopService.query()
            .subscribe((res: HttpResponse<OrderShop[]>) => { this.ordershops = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.orderItem.id !== undefined) {
            this.subscribeToSaveResponse(
                this.orderItemService.update(this.orderItem));
        } else {
            this.subscribeToSaveResponse(
                this.orderItemService.create(this.orderItem));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<OrderItem>>) {
        result.subscribe((res: HttpResponse<OrderItem>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: OrderItem) {
        this.eventManager.broadcast({ name: 'orderItemListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackProductItemById(index: number, item: ProductItem) {
        return item.id;
    }

    trackOrderShopById(index: number, item: OrderShop) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-order-item-popup',
    template: ''
})
export class OrderItemPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private orderItemPopupService: OrderItemPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.orderItemPopupService
                    .open(OrderItemDialogComponent as Component, params['id']);
            } else {
                this.orderItemPopupService
                    .open(OrderItemDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
