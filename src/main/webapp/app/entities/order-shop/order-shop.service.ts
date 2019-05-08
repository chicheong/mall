import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { OrderShop } from './order-shop.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<OrderShop>;

@Injectable()
export class OrderShopService {

    private resourceUrl =  SERVER_API_URL + 'api/order-shops';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/order-shops';

    constructor(private http: HttpClient) { }

    create(orderShop: OrderShop): Observable<EntityResponseType> {
        const copy = this.convert(orderShop);
        return this.http.post<OrderShop>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(orderShop: OrderShop): Observable<EntityResponseType> {
        const copy = this.convert(orderShop);
        return this.http.put<OrderShop>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<OrderShop>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<OrderShop[]>> {
        const options = createRequestOption(req);
        return this.http.get<OrderShop[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<OrderShop[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<OrderShop[]>> {
        const options = createRequestOption(req);
        return this.http.get<OrderShop[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<OrderShop[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: OrderShop = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<OrderShop[]>): HttpResponse<OrderShop[]> {
        const jsonResponse: OrderShop[] = res.body;
        const body: OrderShop[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to OrderShop.
     */
    private convertItemFromServer(orderShop: OrderShop): OrderShop {
        const copy: OrderShop = Object.assign({}, orderShop);
        return copy;
    }

    /**
     * Convert a OrderShop to a JSON which can be sent to the server.
     */
    private convert(orderShop: OrderShop): OrderShop {
        const copy: OrderShop = Object.assign({}, orderShop);
        return copy;
    }
}
