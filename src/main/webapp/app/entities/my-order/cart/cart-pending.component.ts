import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IMyOrder } from 'app/shared/model/my-order.model';
import { MyOrderService } from 'app/entities/my-order/my-order.service';

import { IShipping } from 'app/shared/model/shipping.model';
import { ShippingStatus } from 'app/shared/model/enumerations/shipping-status.model';
import { IAddress } from 'app/shared/model/address.model';
import { IPayment, Payment } from 'app/shared/model/payment.model';
import { PaymentStatus } from 'app/shared/model/enumerations/payment-status.model';
import { IShippingType } from 'app/shared/model/shipping-type.model';
import { IProductItem } from "app/shared/model/product-item.model";
import { IOrderShop, OrderShop } from "app/shared/model/order-shop.model";
import { OrderItem } from "app/shared/model/order-item.model";

@Component({
    selector: 'jhi-cart-pending',
    templateUrl: './cart-pending.component.html',
    styleUrls: [
    ]
})
export class CartPendingComponent implements OnInit {
    isSaving = false;
    myOrder: IMyOrder | null = null;

    constructor(
        protected myOrderService: MyOrderService,
        protected activatedRoute: ActivatedRoute,
        protected router: Router
    ) {}

    ngOnInit(): void {
        this.activatedRoute.data.subscribe(({ myOrder }) => (this.myOrder = myOrder));
    }

    load(id: number): void {
//        console.log('load(id)');
        this.myOrderService.find(id)
            .subscribe((myOrderResponse: HttpResponse<IMyOrder>) => {
                this.myOrder = myOrderResponse.body;
//                console.log('this.myOrder = myOrderResponse.body;');
            });
    }

    sumPrice(): number {
        return this.myOrderService.sumPrice(this.myOrder, true);
    }

    sumChosenQuantity(): number {
        return this.myOrderService.sumChosenQuantity(this.myOrder);
    }

    updateMyOrder(): void {
    }

    checkout(): void {
        this.isSaving = true;
        // Only for checked items
        if (this.myOrder) {
            this.myOrder.total = this.myOrderService.sumOrderPrice(this.myOrder);
            this.subscribeToCheckoutResponse(
                  this.myOrderService.checkout(this.myOrder));            
        }
    }

    deleteOrderItem(orderItemId: number): void {
//        console.log('orderItemId: ' + orderItemId);
//        this.myOrderService.deleteOrderItem(orderItemId).subscribe(response => {
//            this.myOrder.shops.forEach(orderShop => {
//                orderShop.items = orderShop.items.filter(item => item.id !== orderItemId);
//            });
//            this.eventManager.broadcast({ name: 'myOrderModification', content: 'OK', obj: this.myOrder});
//        });
    }

    save(): void {
        this.isSaving = true;
        if (this.myOrder) {
            this.myOrder.total = this.myOrderService.sumOrderPrice(this.myOrder);
            this.subscribeToSaveResponse(
                    this.myOrderService.update(this.myOrder));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IMyOrder>>): void {
        result.subscribe(
            (res: HttpResponse<IMyOrder>) => this.onSaveSuccess(res.body), 
            (res: HttpErrorResponse) => this.onError()
        );
    }

    private onSaveSuccess(result: IMyOrder | null): void {
        this.myOrder = result;
//        this.eventManager.broadcast({ name: 'myOrderModification', content: 'OK', obj: result});
        this.isSaving = false;
    }

    private subscribeToCheckoutResponse(result: Observable<HttpResponse<IMyOrder>>): void {
        result.subscribe(
            (res: HttpResponse<IMyOrder>) => this.onCheckoutSuccess(res.body), 
            (res: HttpErrorResponse) => this.onError()
        );
    }

    private onCheckoutSuccess(result: IMyOrder | null): void {
        this.isSaving = false;
        if (result){
            this.router.navigate(['/my-order', result.id, 'review']);
        }
    }

    private onError(): void {
        this.isSaving = false;
    }
    
    canGoNext(): boolean {
        if (this.myOrder && this.myOrder.shops) {
            const totalQuantity = this.myOrderService.sumQuantity(this.myOrder, true);
            const totalPrice = this.myOrderService.sumPrice(this.myOrder, true);
//            console.log('totalQuantity: ' + totalQuantity + ', totalPrice: ' + totalPrice);
            if (totalQuantity > 0 && totalPrice > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    previousState(): void {
        window.history.back();
    }

    itemChanged(shop: OrderShop, item: OrderItem, event: any): void {
        item.isChecked = event.checked;
        /**
        shop.isChecked = shop.items.every(function(item: any) {
            return item.isChecked === true;
        });
        shop.indeterminate = shop.items.some(function(item: any) {
            return item.isChecked === true;
        });
        */
        const totalSelected = shop.items!.filter(i => i.isChecked).length;
        if (totalSelected === 0) {
            shop.isChecked = false;
            shop.indeterminate = false;
        } else if (totalSelected > 0 && totalSelected < shop.items!.length) {
            shop.isChecked = false;
            shop.indeterminate = true;
        } else if (totalSelected === shop.items!.length) {
            shop.isChecked = true;
            shop.indeterminate = false;
        }
    }

    toggleShop(shop: OrderShop, event: any): void {
        shop.isChecked = event.checked;
        shop.items!.forEach(item => {
            item.isChecked = event.checked;
        });
    }
}
