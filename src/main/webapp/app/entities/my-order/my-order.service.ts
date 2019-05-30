import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IMyOrder, PaypalOrderItem } from 'app/shared/model/my-order.model';

import { IProductItem } from 'app/shared/model/product-item.model';
import { IOrderItem } from 'app/shared/model/order-item.model';

import { CartControl } from './cart/cart-control/cart-control';
import { CartControlType } from './cart/cart-control/cart-control-type';

type EntityResponseType = HttpResponse<IMyOrder>;
type EntityArrayResponseType = HttpResponse<IMyOrder[]>;

@Injectable({ providedIn: 'root' })
export class MyOrderService {
    public resourceUrl = SERVER_API_URL + 'api/my-orders';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/my-orders';
    private resourceCartUrl = SERVER_API_URL + 'api/my-cart';

    private billingControl = CartControlType.HIDE;
    private paymentControl = CartControlType.ACTIVE;
    private reviewControl = CartControlType.ACTIVE;
    private methodControl = CartControlType.ACTIVE;
    private shippingControl = CartControlType.ACTIVE;
    private errorPathSuffix = 'review';
    private pathPrefix = 'my-order';

    // Determine if paypal script is added to index or not
    public paypalScriptTagElement: any;
    // Determine if stripe script is added to index or not
    public stripeScriptTagElement: any;

    constructor(protected http: HttpClient, private router: Router) {}

    create(myOrder: IMyOrder): Observable<EntityResponseType> {
        return this.http.post<IMyOrder>(this.resourceUrl, myOrder, { observe: 'response' });
    }

    update(myOrder: IMyOrder): Observable<EntityResponseType> {
        return this.http.put<IMyOrder>(this.resourceUrl, myOrder, { observe: 'response' });
    }

    charge(myOrder: IMyOrder): Observable<EntityResponseType> {
        return this.http.put<IMyOrder>(`${this.resourceUrl}/charge`, myOrder, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IMyOrder>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IMyOrder[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IMyOrder[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }

    addToCart(productItem: IProductItem, quantity: number): Observable<HttpResponse<IMyOrder>> {
        const copy: IProductItem = Object.assign({}, productItem);
        const orderItem: IOrderItem = Object.assign({});
        orderItem.productItem = copy;
        orderItem.quantity = quantity;
        orderItem.currency = copy.currency;
        console.error('copy.currency: ' + copy.currency);
        orderItem.price = copy.price;
        return this.http.post<IMyOrder>(this.resourceCartUrl, orderItem, { observe: 'response' });
    }

    getCartControl(myOrder: IMyOrder, path: String): CartControl {
        const obj: CartControl = new CartControl();
        switch (path) {
            case 'review':
                console.error('review');
                if (this.reviewControl !== CartControlType.HIDE) {
                    obj.reviewControl = CartControlType.ACTIVE;
                }
                if (this.shippingControl !== CartControlType.HIDE) {
                    obj.shippingControl = CartControlType.DISABLED;
                }
                if (this.methodControl !== CartControlType.HIDE) {
                    obj.methodControl = CartControlType.DISABLED;
                }
                if (this.billingControl !== CartControlType.HIDE) {
                    obj.billingControl = CartControlType.DISABLED;
                }
                if (this.paymentControl !== CartControlType.HIDE) {
                    obj.paymentControl = CartControlType.DISABLED;
                }
                break;
            case 'shipping':
                console.error('shipping');
                if (this.reviewControl !== CartControlType.HIDE) {
                    obj.reviewControl = CartControlType.COMPLETE;
                }
                if (this.shippingControl !== CartControlType.HIDE) {
                    obj.shippingControl = CartControlType.ACTIVE;
                } else {
                    this.router.navigate(['/' + this.pathPrefix + '/' + myOrder.id + '/' + this.errorPathSuffix]);
                }
                if (this.methodControl !== CartControlType.HIDE) {
                    obj.methodControl = CartControlType.DISABLED;
                }
                if (this.billingControl !== CartControlType.HIDE) {
                    obj.billingControl = CartControlType.DISABLED;
                }
                if (this.paymentControl !== CartControlType.HIDE) {
                    obj.paymentControl = CartControlType.DISABLED;
                }
                break;
            case 'method':
                console.error('method');
                if (this.reviewControl !== CartControlType.HIDE) {
                    obj.reviewControl = CartControlType.COMPLETE;
                }
                if (this.shippingControl !== CartControlType.HIDE) {
                    obj.shippingControl = CartControlType.COMPLETE;
                }
                if (this.methodControl !== CartControlType.HIDE) {
                    obj.methodControl = CartControlType.ACTIVE;
                } else {
                    this.router.navigate(['/' + this.pathPrefix + '/' + myOrder.id + '/' + this.errorPathSuffix]);
                }
                if (this.billingControl !== CartControlType.HIDE) {
                    obj.billingControl = CartControlType.DISABLED;
                }
                if (this.paymentControl !== CartControlType.HIDE) {
                    obj.paymentControl = CartControlType.DISABLED;
                }
                break;
            case 'billing':
                console.error('billing');
                if (this.reviewControl !== CartControlType.HIDE) {
                    obj.reviewControl = CartControlType.COMPLETE;
                }
                if (this.shippingControl !== CartControlType.HIDE) {
                    obj.shippingControl = CartControlType.COMPLETE;
                }
                if (this.methodControl !== CartControlType.HIDE) {
                    obj.methodControl = CartControlType.COMPLETE;
                }
                if (this.billingControl !== CartControlType.HIDE) {
                    obj.billingControl = CartControlType.ACTIVE;
                } else {
                    this.router.navigate(['/' + this.pathPrefix + '/' + myOrder.id + '/' + this.errorPathSuffix]);
                }
                if (this.paymentControl !== CartControlType.HIDE) {
                    obj.paymentControl = CartControlType.DISABLED;
                }
                break;
            case 'payment':
                console.error('payment');
                if (this.reviewControl !== CartControlType.HIDE) {
                    obj.reviewControl = CartControlType.COMPLETE;
                }
                if (this.shippingControl !== CartControlType.HIDE) {
                    obj.shippingControl = CartControlType.COMPLETE;
                }
                if (this.methodControl !== CartControlType.HIDE) {
                    obj.methodControl = CartControlType.COMPLETE;
                }
                if (this.billingControl !== CartControlType.HIDE) {
                    obj.billingControl = CartControlType.COMPLETE;
                }
                if (this.paymentControl !== CartControlType.HIDE) {
                    obj.paymentControl = CartControlType.ACTIVE;
                } else {
                    this.router.navigate(['/' + this.pathPrefix + '/' + myOrder.id + '/' + this.errorPathSuffix]);
                }
                break;
            default:
                console.error('default');
                break;
        }
        return obj;
    }

    doCartNextAction(myOrder: IMyOrder, path: String): void {
        switch (path) {
            case 'review':
                this.doCartReviewNextAction(myOrder);
                break;
            case 'shipping':
                this.doCartShippingNextAction(myOrder);
                break;
            case 'method':
                this.doCartMethodNextAction(myOrder);
                break;
            case 'billing':
                this.doCartBillingNextAction(myOrder);
                break;
            case 'payment':
                this.doCartPaymentNextAction(myOrder);
                break;
            default:
                console.error('default');
                break;
        }
    }

    doCartReviewNextAction(myOrder: IMyOrder): void {
        if (this.shippingControl !== CartControlType.HIDE) {
            this.router.navigate(['/' + this.pathPrefix + '/' + myOrder.id + '/shipping']);
        } else {
            this.doCartShippingNextAction(myOrder);
        }
    }

    doCartShippingNextAction(myOrder: IMyOrder): void {
        if (this.methodControl !== CartControlType.HIDE) {
            this.router.navigate(['/' + this.pathPrefix + '/' + myOrder.id + '/method']);
        } else {
            this.doCartMethodNextAction(myOrder);
        }
    }

    doCartMethodNextAction(myOrder: IMyOrder): void {
        if (this.billingControl !== CartControlType.HIDE) {
            this.router.navigate(['/' + this.pathPrefix + '/' + myOrder.id + '/billing']);
        } else {
            this.doCartBillingNextAction(myOrder);
        }
    }

    doCartBillingNextAction(myOrder: IMyOrder): void {
        if (this.paymentControl !== CartControlType.HIDE) {
            this.router.navigate(['/' + this.pathPrefix + '/' + myOrder.id + '/payment']);
        } else {
            this.doCartPaymentNextAction(myOrder);
        }
    }

    doCartPaymentNextAction(myOrder: IMyOrder): void {
        this.router.navigate(['/' + this.pathPrefix + '/' + myOrder.id + '/confirmation']);
    }

    doCartBackAction(myOrder: IMyOrder, path: String): void {
        switch (path) {
            case 'review':
                this.doCartReviewBackAction(myOrder);
                break;
            case 'shipping':
                this.doCartShippingBackAction(myOrder);
                break;
            case 'method':
                this.doCartMethodBackAction(myOrder);
                break;
            case 'billing':
                this.doCartBillingBackAction(myOrder);
                break;
            case 'payment':
                this.doCartPaymentBackAction(myOrder);
                break;
            default:
                console.error('default');
                break;
        }
    }

    doCartReviewBackAction(myOrder: IMyOrder): void {
        window.history.back();
    }

    doCartShippingBackAction(myOrder: IMyOrder): void {
        if (this.reviewControl !== CartControlType.HIDE) {
            this.router.navigate(['/' + this.pathPrefix + '/' + myOrder.id + '/review']);
        } else {
            this.doCartReviewBackAction(myOrder);
        }
    }

    doCartMethodBackAction(myOrder: IMyOrder): void {
        if (this.shippingControl !== CartControlType.HIDE) {
            this.router.navigate(['/' + this.pathPrefix + '/' + myOrder.id + '/shipping']);
        } else {
            this.doCartShippingBackAction(myOrder);
        }
    }

    doCartBillingBackAction(myOrder: IMyOrder): void {
        if (this.methodControl !== CartControlType.HIDE) {
            this.router.navigate(['/' + this.pathPrefix + '/' + myOrder.id + '/method']);
        } else {
            this.doCartMethodBackAction(myOrder);
        }
    }

    doCartPaymentBackAction(myOrder: IMyOrder): void {
        if (this.billingControl !== CartControlType.HIDE) {
            this.router.navigate(['/' + this.pathPrefix + '/' + myOrder.id + '/billing']);
        } else {
            this.doCartBillingBackAction(myOrder);
        }
    }

    calculateTotalProductPrice(myOrder: IMyOrder): number {
        let total = 0;
        if (myOrder.shops) {
            myOrder.shops.forEach(shop => {
               shop.items.forEach(item => {
                   total += (item.quantity * item.price);
               });
            });
        }
        return total;
    }

    calculateTotalShippingPrice(myOrder: IMyOrder): number {
        let total = 0;
        if (myOrder.shops) {
            myOrder.shops.forEach(shop => {
                if (shop.shipping) {
                    total += shop.shipping.price;
                }
            });
        }
        return total;
    }

    calculateTotalPrice(myOrder: IMyOrder): number {
        return this.calculateTotalProductPrice(myOrder) + this.calculateTotalShippingPrice(myOrder);
    }

    calculateTotalQuantity(myOrder: IMyOrder): number {
        let total = 0;
        if (myOrder.shops) {
            myOrder.shops.forEach(shop => {
               console.error('shop.items: ' + shop.items);
               if (shop.items) {
                   shop.items.forEach(item => {
                       total += item.quantity;
                   });
               }
            });
        }
        return total;
    }

    getPaypalOrderItems(myOrder: IMyOrder): PaypalOrderItem[] {
        const paypalOrderItems: PaypalOrderItem[] = [];
        if (myOrder.shops) {
            let paypalOrderItem: PaypalOrderItem;
            myOrder.shops.forEach(shop => {
                shop.items.forEach(item => {
                    paypalOrderItem = Object.assign(new PaypalOrderItem());
                    paypalOrderItem.name = 'name' + item.id;
                    paypalOrderItem.description = 'product' + item.id;
                    paypalOrderItem.price = item.price;
                    paypalOrderItem.quantity = item.quantity;
                    paypalOrderItem.currency = item.currency;
                    paypalOrderItem.tax = 0;
                    paypalOrderItems.push(paypalOrderItem);
                });
            });
        }
        console.error('paypalOrderItems: ' + paypalOrderItems);
        return paypalOrderItems;
    }
}
