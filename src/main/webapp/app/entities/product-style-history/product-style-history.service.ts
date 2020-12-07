import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, Search } from 'app/shared/util/request-util';
import { IProductStyleHistory } from 'app/shared/model/product-style-history.model';

type EntityResponseType = HttpResponse<IProductStyleHistory>;
type EntityArrayResponseType = HttpResponse<IProductStyleHistory[]>;

@Injectable({ providedIn: 'root' })
export class ProductStyleHistoryService {
  public resourceUrl = SERVER_API_URL + 'api/product-style-histories';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/product-style-histories';

  constructor(protected http: HttpClient) {}

  create(productStyleHistory: IProductStyleHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productStyleHistory);
    return this.http
      .post<IProductStyleHistory>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(productStyleHistory: IProductStyleHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productStyleHistory);
    return this.http
      .put<IProductStyleHistory>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IProductStyleHistory>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IProductStyleHistory[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: Search): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IProductStyleHistory[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateFromClient(productStyleHistory: IProductStyleHistory): IProductStyleHistory {
    const copy: IProductStyleHistory = Object.assign({}, productStyleHistory, {
      createdDate:
        productStyleHistory.createdDate && productStyleHistory.createdDate.isValid() ? productStyleHistory.createdDate.toJSON() : undefined
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.createdDate = res.body.createdDate ? moment(res.body.createdDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((productStyleHistory: IProductStyleHistory) => {
        productStyleHistory.createdDate = productStyleHistory.createdDate ? moment(productStyleHistory.createdDate) : undefined;
      });
    }
    return res;
  }
}
