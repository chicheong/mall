import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { MyOrder } from './my-order.model';
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

    constructor(private http: HttpClient) { }

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
        return obj;
    }
}
