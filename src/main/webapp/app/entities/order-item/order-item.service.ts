import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { OrderItem } from './order-item.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class OrderItemService {

    private resourceUrl = 'api/order-items';
    private resourceSearchUrl = 'api/_search/order-items';

    constructor(private http: Http) { }

    create(orderItem: OrderItem): Observable<OrderItem> {
        const copy = this.convert(orderItem);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(orderItem: OrderItem): Observable<OrderItem> {
        const copy = this.convert(orderItem);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<OrderItem> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
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
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convert(orderItem: OrderItem): OrderItem {
        const copy: OrderItem = Object.assign({}, orderItem);
        return copy;
    }
}
