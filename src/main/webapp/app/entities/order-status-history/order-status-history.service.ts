import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { OrderStatusHistory } from './order-status-history.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<OrderStatusHistory>;

@Injectable()
export class OrderStatusHistoryService {

    private resourceUrl =  SERVER_API_URL + 'api/order-status-histories';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/order-status-histories';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(orderStatusHistory: OrderStatusHistory): Observable<EntityResponseType> {
        const copy = this.convert(orderStatusHistory);
        return this.http.post<OrderStatusHistory>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(orderStatusHistory: OrderStatusHistory): Observable<EntityResponseType> {
        const copy = this.convert(orderStatusHistory);
        return this.http.put<OrderStatusHistory>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<OrderStatusHistory>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<OrderStatusHistory[]>> {
        const options = createRequestOption(req);
        return this.http.get<OrderStatusHistory[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<OrderStatusHistory[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<OrderStatusHistory[]>> {
        const options = createRequestOption(req);
        return this.http.get<OrderStatusHistory[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<OrderStatusHistory[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: OrderStatusHistory = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<OrderStatusHistory[]>): HttpResponse<OrderStatusHistory[]> {
        const jsonResponse: OrderStatusHistory[] = res.body;
        const body: OrderStatusHistory[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to OrderStatusHistory.
     */
    private convertItemFromServer(orderStatusHistory: OrderStatusHistory): OrderStatusHistory {
        const copy: OrderStatusHistory = Object.assign({}, orderStatusHistory);
        copy.effectiveDate = this.dateUtils
            .convertDateTimeFromServer(orderStatusHistory.effectiveDate);
        return copy;
    }

    /**
     * Convert a OrderStatusHistory to a JSON which can be sent to the server.
     */
    private convert(orderStatusHistory: OrderStatusHistory): OrderStatusHistory {
        const copy: OrderStatusHistory = Object.assign({}, orderStatusHistory);

        copy.effectiveDate = this.dateUtils.toDate(orderStatusHistory.effectiveDate);
        return copy;
    }
}
