import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IOrderShop } from 'app/shared/model/order-shop.model';
import { OrderShopService } from './order-shop.service';
import { IShipping } from 'app/shared/model/shipping.model';
import { ShippingService } from 'app/entities/shipping';
import { IShop } from 'app/shared/model/shop.model';
import { ShopService } from 'app/entities/shop';
import { IMyOrder } from 'app/shared/model/my-order.model';
import { MyOrderService } from 'app/entities/my-order';

@Component({
    selector: 'jhi-order-shop-update',
    templateUrl: './order-shop-update.component.html'
})
export class OrderShopUpdateComponent implements OnInit {
    orderShop: IOrderShop;
    isSaving: boolean;

    shippings: IShipping[];

    shops: IShop[];

    myorders: IMyOrder[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected orderShopService: OrderShopService,
        protected shippingService: ShippingService,
        protected shopService: ShopService,
        protected myOrderService: MyOrderService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ orderShop }) => {
            this.orderShop = orderShop;
        });
        this.shippingService
            .query({ filter: 'ordershop-is-null' })
            .pipe(
                filter((mayBeOk: HttpResponse<IShipping[]>) => mayBeOk.ok),
                map((response: HttpResponse<IShipping[]>) => response.body)
            )
            .subscribe(
                (res: IShipping[]) => {
                    if (!this.orderShop.shippingId) {
                        this.shippings = res;
                    } else {
                        this.shippingService
                            .find(this.orderShop.shippingId)
                            .pipe(
                                filter((subResMayBeOk: HttpResponse<IShipping>) => subResMayBeOk.ok),
                                map((subResponse: HttpResponse<IShipping>) => subResponse.body)
                            )
                            .subscribe(
                                (subRes: IShipping) => (this.shippings = [subRes].concat(res)),
                                (subRes: HttpErrorResponse) => this.onError(subRes.message)
                            );
                    }
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        this.shopService
            .query({ filter: 'ordershop-is-null' })
            .pipe(
                filter((mayBeOk: HttpResponse<IShop[]>) => mayBeOk.ok),
                map((response: HttpResponse<IShop[]>) => response.body)
            )
            .subscribe(
                (res: IShop[]) => {
                    if (!this.orderShop.shopId) {
                        this.shops = res;
                    } else {
                        this.shopService
                            .find(this.orderShop.shopId)
                            .pipe(
                                filter((subResMayBeOk: HttpResponse<IShop>) => subResMayBeOk.ok),
                                map((subResponse: HttpResponse<IShop>) => subResponse.body)
                            )
                            .subscribe(
                                (subRes: IShop) => (this.shops = [subRes].concat(res)),
                                (subRes: HttpErrorResponse) => this.onError(subRes.message)
                            );
                    }
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        this.myOrderService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IMyOrder[]>) => mayBeOk.ok),
                map((response: HttpResponse<IMyOrder[]>) => response.body)
            )
            .subscribe((res: IMyOrder[]) => (this.myorders = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.orderShop.id !== undefined) {
            this.subscribeToSaveResponse(this.orderShopService.update(this.orderShop));
        } else {
            this.subscribeToSaveResponse(this.orderShopService.create(this.orderShop));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrderShop>>) {
        result.subscribe((res: HttpResponse<IOrderShop>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackShippingById(index: number, item: IShipping) {
        return item.id;
    }

    trackShopById(index: number, item: IShop) {
        return item.id;
    }

    trackMyOrderById(index: number, item: IMyOrder) {
        return item.id;
    }
}
