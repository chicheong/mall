import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { MyOrder, PaypalOrderItem } from './my-order.model';
import { createRequestOption } from '../../shared';
import { ProductItem } from './../product-item';
import { OrderItem } from './../order-item';

import { CartControl } from './cart/cart-control/cart-control';
import { CartControlType } from './cart/cart-control/cart-control-type';

export type EntityResponseType = HttpResponse<MyOrder>;

@Injectable()
export class MyOrderService {

    private resourceUrl =  SERVER_API_URL + 'api/my-orders';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/my-orders';
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

    constructor(private http: HttpClient, private router: Router) { }

    create(myOrder: MyOrder): Observable<EntityResponseType> {
        const copy = this.convert(myOrder);
        return this.http.post<MyOrder>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(myOrder: MyOrder): Observable<EntityResponseType> {
        const copy = this.convert(myOrder);
        return this.http.put<MyOrder>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    charge(myOrder: MyOrder): Observable<EntityResponseType> {
        const copy = this.convert(myOrder);
        return this.http.put<MyOrder>(`${this.resourceUrl}/charge`, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<MyOrder>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<MyOrder[]>> {
        const options = createRequestOption(req);
        return this.http.get<MyOrder[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<MyOrder[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<MyOrder[]>> {
        const options = createRequestOption(req);
        return this.http.get<MyOrder[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<MyOrder[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: MyOrder = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<MyOrder[]>): HttpResponse<MyOrder[]> {
        const jsonResponse: MyOrder[] = res.body;
        const body: MyOrder[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to MyOrder.
     */
    private convertItemFromServer(myOrder: MyOrder): MyOrder {
        const copy: MyOrder = Object.assign({}, myOrder);
        return copy;
    }

    /**
     * Convert a MyOrder to a JSON which can be sent to the server.
     */
    private convert(myOrder: MyOrder): MyOrder {
        const copy: MyOrder = Object.assign({}, myOrder);
        return copy;
    }

    addToCart(productItem: ProductItem, quantity: number): Observable<HttpResponse<MyOrder>> {
        const copy: ProductItem = Object.assign({}, productItem);
        const orderItem: OrderItem = Object.assign({});
        orderItem.productItem = copy;
        orderItem.quantity = quantity;
        orderItem.currency = copy.currency;
        console.error('copy.currency: ' + copy.currency);
        orderItem.price = copy.price;
        return this.http.post<MyOrder>(this.resourceCartUrl, orderItem, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    getCartControl(myOrder: MyOrder, path: String): CartControl {
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

    doCartNextAction(myOrder: MyOrder, path: String): void {
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

    doCartReviewNextAction(myOrder: MyOrder): void {
        if (this.shippingControl !== CartControlType.HIDE) {
            this.router.navigate(['/' + this.pathPrefix + '/' + myOrder.id + '/shipping']);
        } else {
            this.doCartShippingNextAction(myOrder);
        }
    }

    doCartShippingNextAction(myOrder: MyOrder): void {
        if (this.methodControl !== CartControlType.HIDE) {
            this.router.navigate(['/' + this.pathPrefix + '/' + myOrder.id + '/method']);
        } else {
            this.doCartMethodNextAction(myOrder);
        }
    }

    doCartMethodNextAction(myOrder: MyOrder): void {
        if (this.billingControl !== CartControlType.HIDE) {
            this.router.navigate(['/' + this.pathPrefix + '/' + myOrder.id + '/billing']);
        } else {
            this.doCartBillingNextAction(myOrder);
        }
    }

    doCartBillingNextAction(myOrder: MyOrder): void {
        if (this.paymentControl !== CartControlType.HIDE) {
            this.router.navigate(['/' + this.pathPrefix + '/' + myOrder.id + '/payment']);
        } else {
            this.doCartPaymentNextAction(myOrder);
        }
    }

    doCartPaymentNextAction(myOrder: MyOrder): void {
        this.router.navigate(['/' + this.pathPrefix + '/' + myOrder.id + '/confirmation']);
    }

    doCartBackAction(myOrder: MyOrder, path: String): void {
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

    doCartReviewBackAction(myOrder: MyOrder): void {
        window.history.back();
    }

    doCartShippingBackAction(myOrder: MyOrder): void {
        if (this.reviewControl !== CartControlType.HIDE) {
            this.router.navigate(['/' + this.pathPrefix + '/' + myOrder.id + '/review']);
        } else {
            this.doCartReviewBackAction(myOrder);
        }
    }

    doCartMethodBackAction(myOrder: MyOrder): void {
        if (this.shippingControl !== CartControlType.HIDE) {
            this.router.navigate(['/' + this.pathPrefix + '/' + myOrder.id + '/shipping']);
        } else {
            this.doCartShippingBackAction(myOrder);
        }
    }

    doCartBillingBackAction(myOrder: MyOrder): void {
        if (this.methodControl !== CartControlType.HIDE) {
            this.router.navigate(['/' + this.pathPrefix + '/' + myOrder.id + '/method']);
        } else {
            this.doCartMethodBackAction(myOrder);
        }
    }

    doCartPaymentBackAction(myOrder: MyOrder): void {
        if (this.billingControl !== CartControlType.HIDE) {
            this.router.navigate(['/' + this.pathPrefix + '/' + myOrder.id + '/billing']);
        } else {
            this.doCartBillingBackAction(myOrder);
        }
    }

    getTotalProductPrice(myOrder: MyOrder): number {
        if (myOrder.shops) {
            let total = 0;
            myOrder.shops.forEach((shop) => {
               shop.items.forEach((item) => {
                   total += (item.quantity * item.price);
               });
            });
            return total;
        }
        return 0;
    }

    getTotalPrice(myOrder: MyOrder): number {
        let shippingTotal = 0;
        if (myOrder.shops) {
            myOrder.shops.forEach((shop) => {
                if (shop.shipping) {
                  shippingTotal += shop.shipping.price;
                }
            });
        }
        return this.getTotalProductPrice(myOrder) + shippingTotal;
    }

    getTotalQuantity(myOrder: MyOrder): number {
        if (myOrder.shops) {
            let total = 0;
            myOrder.shops.forEach((shop) => {
               shop.items.forEach((item) => {
                   total += item.quantity;
               });
            });
            return total;
        }
        return 0;
    }

    getPaypalOrderItems(myOrder: MyOrder): PaypalOrderItem[] {
        const paypalOrderItems: PaypalOrderItem[] = [];
        if (myOrder.shops) {
            let paypalOrderItem: PaypalOrderItem;
            myOrder.shops.forEach((shop) => {
                shop.items.forEach((item) => {
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
