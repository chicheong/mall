import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { OrderStatusHistory } from './order-status-history.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class OrderStatusHistoryService {

    private resourceUrl = SERVER_API_URL + 'api/order-status-histories';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/order-status-histories';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(orderStatusHistory: OrderStatusHistory): Observable<OrderStatusHistory> {
        const copy = this.convert(orderStatusHistory);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(orderStatusHistory: OrderStatusHistory): Observable<OrderStatusHistory> {
        const copy = this.convert(orderStatusHistory);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<OrderStatusHistory> {
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
     * Convert a returned JSON object to OrderStatusHistory.
     */
    private convertItemFromServer(json: any): OrderStatusHistory {
        const entity: OrderStatusHistory = Object.assign(new OrderStatusHistory(), json);
        entity.effectiveDate = this.dateUtils
            .convertDateTimeFromServer(json.effectiveDate);
        return entity;
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
