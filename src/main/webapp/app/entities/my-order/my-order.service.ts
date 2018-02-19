import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { MyOrder } from './my-order.model';
import { ResponseWrapper, createRequestOption } from '../../shared';
import { ProductItem } from './../product-item';
import { OrderItem } from './../order-item';

@Injectable()
export class MyOrderService {

    private resourceUrl = SERVER_API_URL + 'api/my-orders';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/my-orders';
    private resourceCartUrl = SERVER_API_URL + 'api/my-cart';

    constructor(private http: Http) { }

    create(myOrder: MyOrder): Observable<MyOrder> {
        const copy = this.convert(myOrder);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(myOrder: MyOrder): Observable<MyOrder> {
        const copy = this.convert(myOrder);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<MyOrder> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceSearchUrl, options)
            .map((res: any) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    /**
     * Convert a returned JSON object to MyOrder.
     */
    private convertItemFromServer(json: any): MyOrder {
        const entity: MyOrder = Object.assign(new MyOrder(), json);
        return entity;
    }

    /**
     * Convert a MyOrder to a JSON which can be sent to the server.
     */
    private convert(myOrder: MyOrder): MyOrder {
        const copy: MyOrder = Object.assign({}, myOrder);
        return copy;
    }

    addToCart(productItem: ProductItem, quantity: number): Observable<MyOrder> {
        const copy: ProductItem = Object.assign({}, productItem);
        const orderItem: OrderItem = Object.assign({});
        orderItem.productItem = copy;
        orderItem.quantity = quantity;
        orderItem.currency = copy.currency;
        console.error('copy.currency: ' + copy.currency);
        orderItem.price = copy.price;
        return this.http.post(this.resourceCartUrl, orderItem).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }
}
