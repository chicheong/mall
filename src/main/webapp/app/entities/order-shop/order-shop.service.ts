import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IOrderShop } from 'app/shared/model/order-shop.model';

type EntityResponseType = HttpResponse<IOrderShop>;
type EntityArrayResponseType = HttpResponse<IOrderShop[]>;

@Injectable({ providedIn: 'root' })
export class OrderShopService {
    public resourceUrl = SERVER_API_URL + 'api/order-shops';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/order-shops';

    constructor(protected http: HttpClient) {}

    create(orderShop: IOrderShop): Observable<EntityResponseType> {
        return this.http.post<IOrderShop>(this.resourceUrl, orderShop, { observe: 'response' });
    }

    update(orderShop: IOrderShop): Observable<EntityResponseType> {
        return this.http.put<IOrderShop>(this.resourceUrl, orderShop, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IOrderShop>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IOrderShop[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IOrderShop[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
