import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IOrderStatusHistory } from 'app/shared/model/order-status-history.model';

type EntityResponseType = HttpResponse<IOrderStatusHistory>;
type EntityArrayResponseType = HttpResponse<IOrderStatusHistory[]>;

@Injectable({ providedIn: 'root' })
export class OrderStatusHistoryService {
    public resourceUrl = SERVER_API_URL + 'api/order-status-histories';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/order-status-histories';

    constructor(protected http: HttpClient) {}

    create(orderStatusHistory: IOrderStatusHistory): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(orderStatusHistory);
        return this.http
            .post<IOrderStatusHistory>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(orderStatusHistory: IOrderStatusHistory): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(orderStatusHistory);
        return this.http
            .put<IOrderStatusHistory>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IOrderStatusHistory>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IOrderStatusHistory[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IOrderStatusHistory[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    protected convertDateFromClient(orderStatusHistory: IOrderStatusHistory): IOrderStatusHistory {
        const copy: IOrderStatusHistory = Object.assign({}, orderStatusHistory, {
            effectiveDate:
                orderStatusHistory.effectiveDate != null && orderStatusHistory.effectiveDate.isValid()
                    ? orderStatusHistory.effectiveDate.toJSON()
                    : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.effectiveDate = res.body.effectiveDate != null ? moment(res.body.effectiveDate) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((orderStatusHistory: IOrderStatusHistory) => {
                orderStatusHistory.effectiveDate =
                    orderStatusHistory.effectiveDate != null ? moment(orderStatusHistory.effectiveDate) : null;
            });
        }
        return res;
    }
}
