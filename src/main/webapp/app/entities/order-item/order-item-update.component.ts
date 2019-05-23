import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IOrderItem } from 'app/shared/model/order-item.model';
import { OrderItemService } from './order-item.service';
import { IProductItem } from 'app/shared/model/product-item.model';
import { ProductItemService } from 'app/entities/product-item';
import { IOrderShop } from 'app/shared/model/order-shop.model';
import { OrderShopService } from 'app/entities/order-shop';

@Component({
    selector: 'jhi-order-item-update',
    templateUrl: './order-item-update.component.html'
})
export class OrderItemUpdateComponent implements OnInit {
    orderItem: IOrderItem;
    isSaving: boolean;

    productitems: IProductItem[];

    ordershops: IOrderShop[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected orderItemService: OrderItemService,
        protected productItemService: ProductItemService,
        protected orderShopService: OrderShopService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ orderItem }) => {
            this.orderItem = orderItem;
        });
        this.productItemService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IProductItem[]>) => mayBeOk.ok),
                map((response: HttpResponse<IProductItem[]>) => response.body)
            )
            .subscribe((res: IProductItem[]) => (this.productitems = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.orderShopService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IOrderShop[]>) => mayBeOk.ok),
                map((response: HttpResponse<IOrderShop[]>) => response.body)
            )
            .subscribe((res: IOrderShop[]) => (this.ordershops = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.orderItem.id !== undefined) {
            this.subscribeToSaveResponse(this.orderItemService.update(this.orderItem));
        } else {
            this.subscribeToSaveResponse(this.orderItemService.create(this.orderItem));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrderItem>>) {
        result.subscribe((res: HttpResponse<IOrderItem>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackProductItemById(index: number, item: IProductItem) {
        return item.id;
    }

    trackOrderShopById(index: number, item: IOrderShop) {
        return item.id;
    }
}
