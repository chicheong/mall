import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, SearchWithPagination } from 'app/shared/util/request-util';
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

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IOrderStatusHistory[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateFromClient(orderStatusHistory: IOrderStatusHistory): IOrderStatusHistory {
    const copy: IOrderStatusHistory = Object.assign({}, orderStatusHistory, {
      effectiveDate:
        orderStatusHistory.effectiveDate && orderStatusHistory.effectiveDate.isValid()
          ? orderStatusHistory.effectiveDate.toJSON()
          : undefined
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.effectiveDate = res.body.effectiveDate ? moment(res.body.effectiveDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((orderStatusHistory: IOrderStatusHistory) => {
        orderStatusHistory.effectiveDate = orderStatusHistory.effectiveDate ? moment(orderStatusHistory.effectiveDate) : undefined;
      });
    }
    return res;
  }
}
