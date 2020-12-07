import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, SearchWithPagination } from 'app/shared/util/request-util';
import { IShippingStatusHistory } from 'app/shared/model/shipping-status-history.model';

type EntityResponseType = HttpResponse<IShippingStatusHistory>;
type EntityArrayResponseType = HttpResponse<IShippingStatusHistory[]>;

@Injectable({ providedIn: 'root' })
export class ShippingStatusHistoryService {
  public resourceUrl = SERVER_API_URL + 'api/shipping-status-histories';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/shipping-status-histories';

  constructor(protected http: HttpClient) {}

  create(shippingStatusHistory: IShippingStatusHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shippingStatusHistory);
    return this.http
      .post<IShippingStatusHistory>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(shippingStatusHistory: IShippingStatusHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shippingStatusHistory);
    return this.http
      .put<IShippingStatusHistory>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IShippingStatusHistory>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IShippingStatusHistory[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IShippingStatusHistory[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateFromClient(shippingStatusHistory: IShippingStatusHistory): IShippingStatusHistory {
    const copy: IShippingStatusHistory = Object.assign({}, shippingStatusHistory, {
      effectiveDate:
        shippingStatusHistory.effectiveDate && shippingStatusHistory.effectiveDate.isValid()
          ? shippingStatusHistory.effectiveDate.toJSON()
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
      res.body.forEach((shippingStatusHistory: IShippingStatusHistory) => {
        shippingStatusHistory.effectiveDate = shippingStatusHistory.effectiveDate ? moment(shippingStatusHistory.effectiveDate) : undefined;
      });
    }
    return res;
  }
}
