import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils } from 'ng-jhipster';

import { OrderStatusHistory } from './order-status-history.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class OrderStatusHistoryService {

    private resourceUrl = 'api/order-status-histories';
    private resourceSearchUrl = 'api/_search/order-status-histories';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(orderStatusHistory: OrderStatusHistory): Observable<OrderStatusHistory> {
        const copy = this.convert(orderStatusHistory);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    update(orderStatusHistory: OrderStatusHistory): Observable<OrderStatusHistory> {
        const copy = this.convert(orderStatusHistory);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    find(id: number): Observable<OrderStatusHistory> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
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
        for (let i = 0; i < jsonResponse.length; i++) {
            this.convertItemFromServer(jsonResponse[i]);
        }
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convertItemFromServer(entity: any) {
        entity.effectiveDate = this.dateUtils
            .convertDateTimeFromServer(entity.effectiveDate);
    }

    private convert(orderStatusHistory: OrderStatusHistory): OrderStatusHistory {
        const copy: OrderStatusHistory = Object.assign({}, orderStatusHistory);

        copy.effectiveDate = this.dateUtils.toDate(orderStatusHistory.effectiveDate);
        return copy;
    }
}
