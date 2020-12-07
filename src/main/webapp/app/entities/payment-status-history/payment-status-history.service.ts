import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, SearchWithPagination } from 'app/shared/util/request-util';
import { IPaymentStatusHistory } from 'app/shared/model/payment-status-history.model';

type EntityResponseType = HttpResponse<IPaymentStatusHistory>;
type EntityArrayResponseType = HttpResponse<IPaymentStatusHistory[]>;

@Injectable({ providedIn: 'root' })
export class PaymentStatusHistoryService {
  public resourceUrl = SERVER_API_URL + 'api/payment-status-histories';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/payment-status-histories';

  constructor(protected http: HttpClient) {}

  create(paymentStatusHistory: IPaymentStatusHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paymentStatusHistory);
    return this.http
      .post<IPaymentStatusHistory>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(paymentStatusHistory: IPaymentStatusHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paymentStatusHistory);
    return this.http
      .put<IPaymentStatusHistory>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPaymentStatusHistory>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPaymentStatusHistory[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPaymentStatusHistory[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateFromClient(paymentStatusHistory: IPaymentStatusHistory): IPaymentStatusHistory {
    const copy: IPaymentStatusHistory = Object.assign({}, paymentStatusHistory, {
      effectiveDate:
        paymentStatusHistory.effectiveDate && paymentStatusHistory.effectiveDate.isValid()
          ? paymentStatusHistory.effectiveDate.toJSON()
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
      res.body.forEach((paymentStatusHistory: IPaymentStatusHistory) => {
        paymentStatusHistory.effectiveDate = paymentStatusHistory.effectiveDate ? moment(paymentStatusHistory.effectiveDate) : undefined;
      });
    }
    return res;
  }
}
