import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { OrderItem } from './order-item.model';
import { OrderItemPopupService } from './order-item-popup.service';
import { OrderItemService } from './order-item.service';
import { ProductItem, ProductItemService } from '../product-item';
import { MyOrder, MyOrderService } from '../my-order';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-order-item-dialog',
    templateUrl: './order-item-dialog.component.html'
})
export class OrderItemDialogComponent implements OnInit {

    orderItem: OrderItem;
    isSaving: boolean;

    productitems: ProductItem[];

    myorders: MyOrder[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private orderItemService: OrderItemService,
        private productItemService: ProductItemService,
        private myOrderService: MyOrderService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.productItemService
            .query({filter: 'orderitem-is-null'})
            .subscribe((res: ResponseWrapper) => {
                if (!this.orderItem.productItem || !this.orderItem.productItem.id) {
                    this.productitems = res.json;
                } else {
                    this.productItemService
                        .find(this.orderItem.productItem.id)
                        .subscribe((subRes: ProductItem) => {
                            this.productitems = [subRes].concat(res.json);
                        }, (subRes: ResponseWrapper) => this.onError(subRes.json));
                }
            }, (res: ResponseWrapper) => this.onError(res.json));
        this.myOrderService.query()
            .subscribe((res: ResponseWrapper) => { this.myorders = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
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

    private subscribeToSaveResponse(result: Observable<OrderItem>) {
        result.subscribe((res: OrderItem) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
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

    trackMyOrderById(index: number, item: MyOrder) {
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
